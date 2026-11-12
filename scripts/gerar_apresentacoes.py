"""Gera os arquivos .pptx das apresentações a partir dos roteiros em Markdown.

Uso:
    python -m pip install --user python-pptx
    python scripts/gerar_apresentacoes.py

O Markdown usa a sintaxe do Marp: slides separados por uma linha ``---``,
títulos com ``#``/``##`` e notas do orador em comentários ``<!-- nota: ... -->``.
"""

from __future__ import annotations

import re
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

RAIZ = Path(__file__).resolve().parent.parent
PASTA = RAIZ / "apresentacoes"

FUNDO = RGBColor(0x0B, 0x0F, 0x14)
PAINEL = RGBColor(0x11, 0x18, 0x20)
VERDE = RGBColor(0x39, 0xFF, 0x14)
CIANO = RGBColor(0x7D, 0xF9, 0xFF)
TEXTO = RGBColor(0xE6, 0xED, 0xF3)
APAGADO = RGBColor(0x8B, 0x9A, 0xA6)
BORDA = RGBColor(0x1F, 0x6F, 0x3A)

FONTE = "Segoe UI"
FONTE_CODIGO = "Consolas"


def limpar_markdown(texto: str) -> str:
    """Remove marcações simples que não fazem sentido no PowerPoint."""
    texto = re.sub(r"`([^`]*)`", r"\1", texto)
    texto = texto.replace("**", "")
    return texto.strip()


def adicionar_texto_rico(paragrafo, texto: str, cor: RGBColor, tamanho: int, negrito: bool = False) -> None:
    """Adiciona runs preservando negrito e trechos de código."""
    partes = re.split(r"(\*\*.*?\*\*|`[^`]*`)", texto)
    for parte in partes:
        if not parte:
            continue

        if parte.startswith("**") and parte.endswith("**"):
            run = paragrafo.add_run()
            run.text = parte[2:-2]
            run.font.bold = True
            run.font.color.rgb = CIANO
            run.font.name = FONTE
            run.font.size = Pt(tamanho)
            continue

        if parte.startswith("`") and parte.endswith("`"):
            run = paragrafo.add_run()
            run.text = parte[1:-1]
            run.font.bold = negrito
            run.font.color.rgb = CIANO
            run.font.name = FONTE_CODIGO
            run.font.size = Pt(max(1, tamanho - 2))
            continue

        run = paragrafo.add_run()
        run.text = parte
        run.font.bold = negrito
        run.font.color.rgb = cor
        run.font.name = FONTE
        run.font.size = Pt(tamanho)


def adicionar_caixa(slide, esquerda: float, topo: float, largura: float, altura: float):
    caixa = slide.shapes.add_textbox(
        Inches(esquerda), Inches(topo), Inches(largura), Inches(altura)
    )
    quadro = caixa.text_frame
    quadro.word_wrap = True
    quadro.margin_left = 0
    quadro.margin_right = 0
    quadro.margin_top = 0
    quadro.margin_bottom = 0
    return quadro


def adicionar_barra(slide, esquerda: float, topo: float, largura: float, altura: float, cor: RGBColor):
    barra = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE,
        Inches(esquerda),
        Inches(topo),
        Inches(largura),
        Inches(altura),
    )
    barra.fill.solid()
    barra.fill.fore_color.rgb = cor
    barra.line.fill.background()
    return barra


def configurar_fundo(slide) -> None:
    fundo = slide.background
    preenchimento = fundo.fill
    preenchimento.solid()
    preenchimento.fore_color.rgb = FUNDO


def extrair_slides(caminho: Path) -> list[dict]:
    texto = caminho.read_text(encoding="utf-8").replace("\r\n", "\n")

    # Remove o front matter do Marp.
    if texto.startswith("---\n"):
        fim = texto.find("\n---\n", 4)
        if fim != -1:
            texto = texto[fim + 5 :]

    blocos = re.split(r"(?m)^---\s*$", texto)
    slides: list[dict] = []

    for bloco in blocos:
        bloco = bloco.strip()
        if not bloco:
            continue

        notas = re.findall(r"<!--\s*(.*?)\s*-->", bloco, flags=re.S)
        notas_limpas = []
        for nota in notas:
            nota = nota.strip()
            if nota.lower().startswith("nota:"):
                nota = nota[5:].strip()
            if nota:
                notas_limpas.append(nota)

        bloco = re.sub(r"<!--.*?-->", "", bloco, flags=re.S)
        linhas = [linha.rstrip() for linha in bloco.splitlines()]

        titulo = ""
        subtitulo = ""
        corpo: list[tuple[str, str]] = []
        eh_titulo = False

        for linha in linhas:
            linha = linha.strip()
            if not linha:
                continue

            if linha.startswith("# ") and not titulo:
                titulo = limpar_markdown(linha[2:])
                eh_titulo = True
                continue

            if linha.startswith("## ") and not subtitulo:
                if eh_titulo:
                    subtitulo = limpar_markdown(linha[3:])
                elif not titulo:
                    titulo = limpar_markdown(linha[3:])
                else:
                    corpo.append(("subtitulo", limpar_markdown(linha[3:])))
                continue

            if linha.startswith("### "):
                corpo.append(("subtitulo", limpar_markdown(linha[4:])))
                continue

            marcador = re.match(r"^[-*]\s+(.*)$", linha)
            if marcador:
                corpo.append(("item", marcador.group(1).strip()))
                continue

            numerado = re.match(r"^(\d+)\.\s+(.*)$", linha)
            if numerado:
                corpo.append(("numero", f"{numerado.group(1)}. {numerado.group(2).strip()}"))
                continue

            corpo.append(("paragrafo", linha))

        if not titulo:
            continue

        slides.append(
            {
                "titulo": titulo,
                "subtitulo": subtitulo,
                "corpo": corpo,
                "notas": "\n\n".join(notas_limpas),
                "capa": eh_titulo,
            }
        )

    return slides


def criar_slide_capa(prs: Presentation, dados: dict, rodape: str) -> None:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    configurar_fundo(slide)

    adicionar_barra(slide, 0, 0, 13.333, 0.08, VERDE)
    adicionar_barra(slide, 0, 7.42, 13.333, 0.08, VERDE)

    quadro = adicionar_caixa(slide, 1.0, 2.0, 11.3, 1.4)
    paragrafo = quadro.paragraphs[0]
    paragrafo.alignment = PP_ALIGN.CENTER
    adicionar_texto_rico(paragrafo, dados["titulo"], VERDE, 46, negrito=True)

    if dados["subtitulo"]:
        quadro = adicionar_caixa(slide, 1.0, 3.45, 11.3, 0.8)
        paragrafo = quadro.paragraphs[0]
        paragrafo.alignment = PP_ALIGN.CENTER
        adicionar_texto_rico(paragrafo, dados["subtitulo"], CIANO, 26, negrito=True)

    adicionar_barra(slide, 5.6, 4.35, 2.1, 0.035, BORDA)

    linhas = [texto for tipo, texto in dados["corpo"] if tipo in ("paragrafo", "subtitulo")]
    if linhas:
        quadro = adicionar_caixa(slide, 1.0, 4.65, 11.3, 1.7)
        for indice, linha in enumerate(linhas):
            paragrafo = quadro.paragraphs[0] if indice == 0 else quadro.add_paragraph()
            paragrafo.alignment = PP_ALIGN.CENTER
            paragrafo.space_after = Pt(6)
            adicionar_texto_rico(paragrafo, linha, TEXTO if indice == 0 else APAGADO, 17, negrito=indice == 0)

    rodape_caixa = adicionar_caixa(slide, 0.6, 7.05, 12.1, 0.3)
    paragrafo = rodape_caixa.paragraphs[0]
    adicionar_texto_rico(paragrafo, rodape, APAGADO, 9)

    if dados["notas"]:
        slide.notes_slide.notes_text_frame.text = dados["notas"]


def criar_slide_conteudo(prs: Presentation, dados: dict, rodape: str, numero: int) -> None:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    configurar_fundo(slide)

    adicionar_barra(slide, 0, 0, 13.333, 0.08, VERDE)
    adicionar_barra(slide, 0.8, 1.38, 11.73, 0.035, BORDA)

    quadro = adicionar_caixa(slide, 0.8, 0.5, 11.73, 0.8)
    paragrafo = quadro.paragraphs[0]
    adicionar_texto_rico(paragrafo, dados["titulo"], VERDE, 30, negrito=True)

    corpo = adicionar_caixa(slide, 0.8, 1.7, 11.73, 4.85)
    primeiro = True

    for tipo, texto in dados["corpo"]:
        paragrafo = corpo.paragraphs[0] if primeiro else corpo.add_paragraph()
        primeiro = False

        if tipo == "subtitulo":
            paragrafo.space_before = Pt(8)
            paragrafo.space_after = Pt(4)
            adicionar_texto_rico(paragrafo, texto, CIANO, 18, negrito=True)
            continue

        if tipo in ("item", "numero"):
            paragrafo.space_after = Pt(10)
            paragrafo.line_spacing = 1.12
            marcador = "▸ " if tipo == "item" else "◆ "
            run = paragrafo.add_run()
            run.text = marcador
            run.font.color.rgb = VERDE
            run.font.name = FONTE
            run.font.size = Pt(16)
            adicionar_texto_rico(paragrafo, texto, TEXTO, 19)
            continue

        paragrafo.space_before = Pt(4)
        paragrafo.space_after = Pt(8)
        adicionar_texto_rico(paragrafo, texto, TEXTO, 18)

    # Rodapé
    adicionar_barra(slide, 0.8, 6.95, 11.73, 0.02, BORDA)
    rodape_caixa = adicionar_caixa(slide, 0.8, 7.02, 9.0, 0.3)
    adicionar_texto_rico(rodape_caixa.paragraphs[0], rodape, APAGADO, 9)

    numero_caixa = adicionar_caixa(slide, 11.3, 7.02, 1.2, 0.3)
    paragrafo = numero_caixa.paragraphs[0]
    paragrafo.alignment = PP_ALIGN.RIGHT
    adicionar_texto_rico(paragrafo, f"{numero:02d}", APAGADO, 9)

    if dados["notas"]:
        slide.notes_slide.notes_text_frame.text = dados["notas"]


def gerar(markdown: Path, saida: Path, rodape: str) -> int:
    slides = extrair_slides(markdown)
    if not slides:
        raise ValueError(f"Nenhum slide encontrado em {markdown}")

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    for indice, dados in enumerate(slides):
        if dados["capa"]:
            criar_slide_capa(prs, dados, rodape)
        else:
            criar_slide_conteudo(prs, dados, rodape, indice)

    prs.save(saida)
    return len(slides)


def main() -> None:
    trabalhos = [
        ("MARCO6.md", "MARCO6.pptx", "ERROR 404 · Marco 6"),
        ("FINAL.md", "FINAL.pptx", "ERROR 404 · Apresentação final"),
    ]

    for nome_md, nome_pptx, rodape in trabalhos:
        origem = PASTA / nome_md
        destino = PASTA / nome_pptx
        total = gerar(origem, destino, rodape)
        print(f"{destino.relative_to(RAIZ)}: {total} slides")


if __name__ == "__main__":
    main()
