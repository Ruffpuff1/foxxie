package lgbt

import (
	"image"

	"github.com/fogleman/gg"
	"github.com/nfnt/resize"
)

const w, h = 1024, 1024

func Overlay(img *image.Image, overlay *image.Image) image.Image {
	mc := gg.NewContext(w, h)
	mc.DrawCircle(w/2, h/2, w/2)
	mc.SetRGB(255, 255, 255)
	mc.Fill()
	mask := mc.AsMask()

	image := resize.Resize(w, h, *img, resize.Lanczos3)

	dc := gg.NewContext(w, h)
	dc.SetMask(mask)
	dc.Push()
	dc.DrawImage(image, 0, 0)
	dc.Pop()
	dc.DrawImage(*overlay, 0, 0)

	return dc.Image()
}
