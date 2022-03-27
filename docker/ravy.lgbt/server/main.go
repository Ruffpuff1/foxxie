package main

import (
	"flag"
	"image"
	_ "image/jpeg"
	"image/png"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"runtime"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	lgbt "ravy.dev/root/ravy.lgbt"
)

var address string

// https://stackoverflow.com/questions/31873396/is-it-possible-to-get-the-current-root-of-package-structure-as-a-string-in-golan
var (
	_, b, _, _ = runtime.Caller(0)
	basepath   = filepath.Dir(b)
)

func main() {
	flag.Parse()
	log.Printf("listening on %s", address)
	r := chi.NewRouter()
	r.Use(middleware.Logger, middleware.Recoverer, middleware.RequestID)

	transCircle := loadImage("images/circle.png")
	agenderCircle := loadImage("images/circleAgender.png")
	asexualCircle := loadImage("images/circleAsexual.png")
	bisexualCircle := loadImage("images/circleBisexual.png")
	fluidCircle := loadImage("images/circleGenderfluid.png")
	lesbianCircle := loadImage("images/circleLesbian.png")
	enbyCircle := loadImage("images/circleNonbinary.png")
	pansexualCircle := loadImage("images/circlePansexual.png")
	prideCircle := loadImage("images/circlePride.png")

	r.Get("/circle", func(w http.ResponseWriter, r *http.Request) {
		avatarURL := r.URL.Query().Get("image")
		flag := r.URL.Query().Get("type")
		avatar, _ := http.Get(avatarURL) // lgtm [go/request-forgery]

		defer avatar.Body.Close()
		avatarImage, _, _ := image.Decode(avatar.Body)

		var overlay *image.Image

		switch flag {
		case "transgender", "trans":
			overlay = &transCircle
		case "agender":
			overlay = &agenderCircle
		case "asexual", "ace":
			overlay = &asexualCircle
		case "bisexual", "bi":
			overlay = &bisexualCircle
		case "genderfluid", "fluid":
			overlay = &fluidCircle
		case "lesbian", "bean":
			overlay = &lesbianCircle
		case "nonbinary", "enby":
			overlay = &enbyCircle
		case "pansexual", "pan":
			overlay = &pansexualCircle
		case "pride", "lgbt", "gay":
			overlay = &prideCircle
		default:
			overlay = &transCircle
		}

		img := lgbt.Overlay(&avatarImage, overlay)
		png.Encode(w, img)
	})

	log.Fatal(http.ListenAndServe(address, r))
}

func loadImage(imagePath string) image.Image {
	in, err := os.Open(path.Join(basepath, "..", imagePath))
	if err != nil {
		panic(err)
	}
	defer in.Close()

	i, _, _ := image.Decode(in)

	return i
}

func init() {
	flag.StringVar(&address, "address", ":7125", "The hostname:port the server listens at.")
}
