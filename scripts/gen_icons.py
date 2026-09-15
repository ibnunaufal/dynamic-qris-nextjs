from PIL import Image, ImageDraw

INK = (18, 21, 28, 255)
SIGNAL = (255, 90, 54, 255)
WHITE = (255, 255, 255, 255)


def draw_mark(size, bg, fg, pad_ratio=0.20):
    img = Image.new("RGBA", (size, size), bg)
    draw = ImageDraw.Draw(img)
    pad = int(size * pad_ratio)
    inner = size - pad * 2
    unit = inner / 7

    def finder(x0, y0):
        draw.rounded_rectangle(
            [x0, y0, x0 + unit * 3, y0 + unit * 3], radius=unit * 0.55, outline=fg, width=max(2, int(unit * 0.55))
        )
        m = unit * 1.05
        draw.rounded_rectangle([x0 + m, y0 + m, x0 + unit * 3 - m, y0 + unit * 3 - m], radius=unit * 0.25, fill=fg)

    finder(pad, pad)
    finder(pad + unit * 4, pad)
    finder(pad, pad + unit * 4)

    # a few loose "data" dots bottom-right to suggest a dynamic/generated code
    dot = unit * 0.9
    for (dx, dy) in [(4.3, 4.3), (5.6, 4.3), (4.3, 5.6), (5.6, 5.6), (6.3, 4.9)]:
        cx, cy = pad + unit * dx, pad + unit * dy
        draw.ellipse([cx, cy, cx + dot, cy + dot], fill=fg)

    return img


def save(size, path, maskable=False):
    if maskable:
        img = draw_mark(size, SIGNAL, WHITE, pad_ratio=0.30)
    else:
        img = draw_mark(size, INK, SIGNAL, pad_ratio=0.20)
    img.save(path)


save(192, "public/icons/icon-192.png")
save(512, "public/icons/icon-512.png")
save(512, "public/icons/icon-maskable-512.png", maskable=True)
save(180, "public/icons/apple-touch-icon.png")
print("done")
