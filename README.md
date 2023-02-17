# TODO

- [ ] Add some sort of review tab where photos of the day are stored with links
- [ ] If a user leaves the game before finishing, prompt to continue playing when they go to resume
- [ ] Add support buttons (BuyMeACoffee, etc.) to postgame screen
- [x] ~~Move as many state variables to redux as possible~~
- [ ] Create custom global storage; move most logic there
- [ ] localStorage hooks
- [ ] Logging
- [ ] Refactor animations (to avoid using classes with timeouts)
- [ ] CSS overhaul (sass modules?)
- [x] Add quotes to loading screen (get permission first)
- [ ] Quote reveal animation: slide border from right to left
- [ ] Normalize quotes/authors in database (remove new lines, i.e., \n)
- [x] Instead of ERJ and E-Jet, use specific models
- [ ] Add feedback button
- [ ] Add button to mark planes with incorrect metadata
- [x] Fix miniplane borders on shareable
- [ ] Improve Lighthouse scores
- [ ] Change fullscreen menus into smaller modals (only on desktop)
- [ ] PWA (make a shell in app stores)
- [ ] If a mobile device hits the website, prompt to add to home screen
- [ ] rate limiting? e.g. Flask-Limiter

---

- Check all planes in DB for viability
    - [x] ERJ 140
    - [x] C-130
    - [x] ERJ 190
    - [ ] 757
    - [ ] 737
    - [ ] A330
    - [x] DC-3
    - [ ] 767
    - [ ] A350
    - [ ] Dash 8
    - [x] ERJ 135
    - [ ] A320
    - [ ] A340
    - [x] MD-11
    - [ ] CRJ
    - [ ] ERJ 170
    - [ ] 777
    - [ ] 787
    - [x] 727
    - [ ] MD-80
    - [ ] 747
    - [x] Learjet
    - [ ] A380

---

## Ongoing

- What are the optimum weights?
- Should planes be grouped by make/model?
- Create ML model to classify images; use the model to score images based on likelihood of being mislabeled
