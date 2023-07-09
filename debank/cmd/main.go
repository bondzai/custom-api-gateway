package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/PuerkitoBio/goquery"
)

func scrape() {
	res, err := http.Get("https://debank.com/profile/0x1c45e086ed143aef83c1209521a2ff5369f39abc")
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		log.Fatalf("status code error: %d %s", res.StatusCode, res.Status)
	}

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Find the data you need.
	doc.Find(".some-selector").Each(func(i int, s *goquery.Selection) {
		title := s.Find(".another-selector").Text()
		fmt.Printf("Data: '%s'\n", title)
	})
}

func main() {
	scrape()
}
