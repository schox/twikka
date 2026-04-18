# Twikka Coach Image Generation — Prompt Library

**Target tool**: Midjourney v7 (primary), with notes for Flux/alternatives.
**Purpose**: generate photorealistic portraits of the six v1 coaches, suitable for use as stills in the app and as source images for HeyGen avatar creation.

---

## How to use this document

Each coach has two prompt variants:

1. **HeyGen-ready portrait** — front-facing, neutral background, specifically framed for HeyGen's Photo Avatar ingestion. This is the foundational image for each coach.
2. **Hero portrait** — more editorial, three-quarter framing, richer styling. For onboarding screens, marketing, and general brand use.

**Workflow**:

1. Generate the HeyGen-ready portrait first for each coach. Iterate until you have a gold standard you love.
2. Use that gold standard as `--cref [url]` in every subsequent generation for that coach. This locks the face.
3. Use the shared `--sref` (see below) on every generation to lock the visual style across all six coaches.
4. Generate the hero portrait using the HeyGen-ready portrait as `--cref`.
5. For any future marketing variations (different expressions, contexts, outfits), continue using the same `--cref` plus `--sref`.

**Parameters to use on every generation**:

```
--ar 1:1 --v 7 --style raw --s 200
```

- `--ar 1:1` square aspect ratio (HeyGen prefers square; also works for in-app avatars)
- `--v 7` Midjourney v7
- `--style raw` reduces Midjourney's default glossiness; critical for the natural, unpolished look this brand needs
- `--s 200` moderate stylisation; high enough to produce cohesive style, low enough to keep realism

For hero portraits, consider `--ar 4:5` for onboarding screen framing instead.

---

## Shared style foundation

These tokens appear in **every** prompt and are what makes the six feel like one set. Do not vary them between coaches.

**Style stem** (always included):

```
natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, neutral warm background, looking toward camera with gentle expression
```

**Negative tokens** (to be avoided — include as `--no` parameter):

```
--no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, bokeh circles, rim lighting, cinematic drama, vignette, makeup-heavy, hair perfect, watch, jewellery, logo, glasses glare
```

**Style reference image strategy**:

Before generating any coach, you need a `--sref` that locks the style. Options:

1. **Best**: find a reference image from a documentary-style portrait photographer whose work matches the vibe (Platon, Martin Schoeller at his warmest, Annie Leibovitz's quieter work). Use as `--sref`. Not for commercial redistribution — just as style lock during generation.
2. **Alternative**: generate one reference portrait using the shared style stem alone, iterate until you have a style you love (subject can be anyone), then use that generated image as `--sref` for all six coaches.

I recommend option 2 — generated `--sref` has no IP concerns and gives you full control. Generate with a generic prompt:

```
portrait of a kind Australian person in their 40s, warm expression, looking toward camera, [SHARED STYLE STEM] --ar 1:1 --v 7 --style raw --s 200 --no stock photo, corporate, glossy, retouched
```

Once you have a style reference you love, use its URL as `--sref [url]` on every subsequent coach generation.

---

## Coach 1: Priya — 30s, Female

### Design intent

Early 30s woman of South Asian heritage, thoughtful expression, warmth in the eyes, slight hint of reflection in the face. Someone who asks good questions rather than offering quick answers. Not influencer-polished; not clinical; genuinely present.

*Note: if you decide to launch the v1 set as broadly Anglo-Australian with diversity added later, swap the ethnicity phrase for "Anglo-Australian" or remove the ethnicity specifier and let Midjourney default.*

### HeyGen-ready portrait prompt

```
natural portrait photograph of a 34-year-old woman of South Asian heritage, kind attentive eyes with a reflective quality, slight gentle smile, soft dark hair loosely pulled back with a few strands around the face, simple earth-tone linen shirt or knit, front-facing composition looking directly at camera, head and shoulders visible, hands not visible, clean warm cream background, natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, looking toward camera with gentle expression --ar 1:1 --v 7 --style raw --s 200 --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, makeup-heavy, jewellery, logo, glasses
```

### Hero portrait prompt

```
natural portrait photograph of a 34-year-old woman of South Asian heritage, warm reflective expression with eyes slightly crinkled in a quiet smile, looking toward camera three-quarter angle, soft dark hair loosely up with strands falling, simple earth-tone linen shirt, head and shoulders composition, cream and warm neutral background softly out of focus, natural portrait photography, warm documentary lighting, soft directional morning light from upper left, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity --ar 4:5 --v 7 --style raw --s 200 --cref [PRIYA HEYGEN PORTRAIT URL] --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, makeup-heavy, jewellery, logo, glasses
```

---

## Coach 2: Fiona — 45s, Female

### Design intent

Mid-to-late-40s Anglo-Australian woman, sun-marked skin, friendly crow's feet from real smiling over years, practical short-to-shoulder-length hair in natural brown or warm grey. Direct gaze. The face of a woman you'd trust to give you straight information. Likely to be chosen most; she needs to feel universally approachable.

### HeyGen-ready portrait prompt

```
natural portrait photograph of a 47-year-old Anglo-Australian woman, warm direct gaze, confident gentle smile with lips closed or barely parted, friendly crow's feet and laugh lines around the eyes, sun-marked weathered skin with natural texture, practical shoulder-length brown hair touched with grey, simple olive or muted blue button-up shirt, front-facing composition looking directly at camera, head and shoulders visible, hands not visible, clean warm cream background, natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, looking toward camera with gentle expression --ar 1:1 --v 7 --style raw --s 200 --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, makeup-heavy, jewellery, logo, glasses
```

### Hero portrait prompt

```
natural portrait photograph of a 47-year-old Anglo-Australian woman, warm direct gaze with gentle confident half-smile, friendly crow's feet and laugh lines, sun-marked skin with real texture, practical shoulder-length brown hair touched with grey, simple muted olive button-up shirt, three-quarter angle composition, head and shoulders, warm cream and sand background softly out of focus, natural portrait photography, warm documentary lighting, soft directional morning light from upper left, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity --ar 4:5 --v 7 --style raw --s 200 --cref [FIONA HEYGEN PORTRAIT URL] --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, makeup-heavy, jewellery, logo, glasses
```

---

## Coach 3: Margaret — 60s, Female

### Design intent

Early 60s Anglo-Australian woman. Silver hair, soft but not fragile. Deeply warm eyes that have seen a lot. The face of someone friends have always called when things are hard. Reading glasses might be in her hand or pushed up on her head but should not be on her face (they create avatar issues for HeyGen).

**Important**: AI tools systematically age-down faces. Push the age markers actively. Specify *silver hair*, *softly lined face*, *slight neck skin softness*, *age-appropriate expression*. Expect to generate many candidates to find one that genuinely reads as 60-something rather than 50-something-with-grey-hair.

### HeyGen-ready portrait prompt

```
natural portrait photograph of a 63-year-old Anglo-Australian woman, warm compassionate gaze with eyes that have seen a lot of life, gentle closed-mouth smile, softly lined face with visible age markers, silver-grey hair in a simple shoulder-length style, age-appropriate natural skin texture with gentle softness around jaw and neck, simple warm taupe cardigan over a cream top, front-facing composition looking directly at camera, head and shoulders visible, hands not visible, clean warm cream background, natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, looking toward camera with gentle expression --ar 1:1 --v 7 --style raw --s 200 --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, makeup-heavy, jewellery, logo, glasses, young looking, de-aged, excessive retouching, plastic-smooth skin
```

### Hero portrait prompt

```
natural portrait photograph of a 63-year-old Anglo-Australian woman, deeply warm compassionate expression with gentle half-smile, softly lined face with real age markers, silver-grey shoulder-length hair, age-appropriate natural skin texture, simple warm taupe cardigan, three-quarter angle composition, head and shoulders, warm cream background softly out of focus, natural portrait photography, warm documentary lighting, soft directional morning light from upper left, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity --ar 4:5 --v 7 --style raw --s 200 --cref [MARGARET HEYGEN PORTRAIT URL] --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, makeup-heavy, jewellery, logo, glasses, young looking, de-aged, excessive retouching, plastic-smooth skin
```

---

## Coach 4: Ben — 30s, Male

### Design intent

Early 30s Anglo-Australian man. Fit but not gym-polished. Approachable face, easy smile that doesn't work too hard. Wears simple, comfortable clothing (crew-neck tee, linen shirt, henley). Looks like a mate who'd actually answer your message. Should not look like a personal trainer or influencer.

### HeyGen-ready portrait prompt

```
natural portrait photograph of a 32-year-old Anglo-Australian man, warm easy expression with slight natural smile, clear friendly eyes, short-to-medium casual hair in natural brown, light stubble rather than a full beard, simple charcoal or olive crew-neck tee or henley, front-facing composition looking directly at camera, head and shoulders visible, hands not visible, clean warm cream background, natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, looking toward camera with gentle expression --ar 1:1 --v 7 --style raw --s 200 --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, muscular display, gym aesthetic, personal trainer, influencer look, logo, watch, jewellery, glasses
```

### Hero portrait prompt

```
natural portrait photograph of a 32-year-old Anglo-Australian man, warm easy expression with relaxed natural half-smile, short casual brown hair, light stubble, simple charcoal crew-neck tee, three-quarter angle composition, head and shoulders, warm cream and sand background softly out of focus, natural portrait photography, warm documentary lighting, soft directional morning light from upper left, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity --ar 4:5 --v 7 --style raw --s 200 --cref [BEN HEYGEN PORTRAIT URL] --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, muscular display, gym aesthetic, personal trainer, influencer look, logo, watch, jewellery, glasses
```

---

## Coach 5: Rob — 45s, Male

### Design intent

Late 40s Anglo-Australian or mixed-heritage man. Lightly weathered. Short-cropped hair greying at the temples. The face of someone who has done physical work in his life — slight weight through the shoulders, strong hands (though not shown in portrait). Wears a plain work shirt, not activewear. Dry warmth in the face. Not trying to charm.

### HeyGen-ready portrait prompt

```
natural portrait photograph of a 48-year-old Anglo-Australian man, slightly weathered lightly-tanned face, calm steady gaze with the hint of dry humour in the eyes, closed-mouth barely-there smile, short-cropped hair greying at the temples, light stubble or clean-shaven, simple plain working-class button-up shirt in muted blue or charcoal, front-facing composition looking directly at camera, head and shoulders visible, broad shoulders of someone who has done physical work, hands not visible, clean warm cream background, natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, looking toward camera with gentle expression --ar 1:1 --v 7 --style raw --s 200 --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, suit, tie, business attire, influencer look, logo, watch, jewellery, glasses
```

### Hero portrait prompt

```
natural portrait photograph of a 48-year-old Anglo-Australian man, lightly weathered face with dry humour in the calm steady eyes, closed-mouth half-smile, short-cropped hair greying at temples, simple plain muted-blue button-up work shirt, three-quarter angle composition, head and shoulders, warm cream and tan background softly out of focus, natural portrait photography, warm documentary lighting, soft directional morning light from upper left, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity --ar 4:5 --v 7 --style raw --s 200 --cref [ROB HEYGEN PORTRAIT URL] --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, suit, tie, business attire, influencer look, logo, watch, jewellery, glasses
```

---

## Coach 6: Tom — 70s, Male

### Design intent

Early 70s Anglo-Australian man. Neatly but simply dressed. White or close-cropped grey hair. Clear, steady, present eyes. Has the look of someone who has seen weather and spent time outdoors. Calm, trustworthy face. Someone you'd trust with a long silence.

**Important**: same ageing issue as Margaret — Midjourney will under-age this face by default. Push age markers actively, including visible forehead lines, softer jaw, age spots or weathering, slight under-eye softness. Expect to iterate to find a Tom who genuinely reads 70+.

### HeyGen-ready portrait prompt

```
natural portrait photograph of a 71-year-old Anglo-Australian man, calm steady present gaze, gentle closed-mouth smile, visible age markers including forehead lines and softer jawline, weathered skin with real texture and natural age spots, close-cropped white and silver-grey hair, clean-shaven or lightly stubbled, simple muted charcoal or tan knit jumper or button-up, front-facing composition looking directly at camera, head and shoulders visible, hands not visible, clean warm cream background, natural portrait photography, warm documentary lighting, soft directional morning light, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity, looking toward camera with gentle expression --ar 1:1 --v 7 --style raw --s 200 --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, logo, watch, jewellery, glasses, young looking, de-aged, middle-aged
```

### Hero portrait prompt

```
natural portrait photograph of a 71-year-old Anglo-Australian man, calm steady gaze with gentle closed-mouth half-smile, visible age markers, weathered skin with real texture, close-cropped white-grey hair, simple muted tan knit jumper, three-quarter angle composition, head and shoulders, warm cream background softly out of focus, natural portrait photography, warm documentary lighting, soft directional morning light from upper left, shallow depth of field, 85mm lens, medium format quality, subtle film grain, honest and unretouched skin, warm earth-tone colour palette, quiet dignity --ar 4:5 --v 7 --style raw --s 200 --cref [TOM HEYGEN PORTRAIT URL] --sref [STYLE REFERENCE URL] --no stock photo, smug, corporate, glossy, oversaturated, beauty retouching, plastic skin, fake smile, teeth-baring grin, studio flash, harsh shadows, rim lighting, cinematic drama, vignette, logo, watch, jewellery, glasses, young looking, de-aged, middle-aged
```

---

## HeyGen avatar creation — practical tips

Once you have a gold-standard portrait for each coach, creating the HeyGen avatar:

1. **Use HeyGen's Photo Avatar (not Instant or Studio Avatar)** since you don't have real footage.
2. **Upload the HeyGen-ready variant**, not the hero portrait. The front-facing framing is critical.
3. **Test each coach with a short script before committing.** Some AI-generated faces animate well in HeyGen; others produce weird mouth movements, jaw drift, or eye issues. Generate, test, regenerate if needed.
4. **Try the same face with minor variations.** Sometimes a nearly-identical regeneration animates dramatically better. If Margaret's mouth looks wrong in motion, generate three more versions of her and test all.
5. **Voice pairing**: HeyGen has Australian voices; select voices that match the persona (warm older female voice for Margaret, warm younger female for Priya, etc). You can also clone voices from your own recordings later if you want full control.
6. **Keep base portraits at highest resolution possible.** Upscale via Midjourney or an external upscaler before feeding to HeyGen. The source image quality directly affects avatar output quality.

---

## Using these portraits in the app

Once you have the six gold-standard portraits:

### App avatar sizes

Generate (via crop-and-resize) the following variants for each coach:

- **Hero (onboarding)**: 800×1000 (4:5 hero portrait, full)
- **Coach profile**: 512×512 (square crop of face + shoulders)
- **Chat header**: 120×120 (tight crop on face)
- **Message avatar**: 80×80 (very tight crop on face — facial features must still read clearly)
- **Tiny avatar (list views)**: 40×40 (essentially face-only, no hair beyond a small margin)

The tight small crops are where AI portraits most often fail. Generate specifically testing how the face reads at 40×40. If it doesn't read as a distinct person at that size, you need more facial distinctiveness in the base portrait.

### Storage

All final portraits in R2, organised by coach:

```
coaches/
  priya/
    hero.jpg
    profile.jpg
    chat.jpg
    message.jpg
    tiny.jpg
    heygen-avatar.mp4 (reference)
  margaret/
    ...
```

### Naming and references

In the Convex `coaches` table, store references to all size variants so the UI picks the right one per context. See the data model section of the main PRD.

---

## If Midjourney doesn't produce results you like

**Fallback option 1: Flux (via fal.ai or Replicate)**

Flux is currently the strongest open-source photoreal model. Workflow is similar:

1. Generate candidates using the same prompt text (translated to Flux syntax, which is closer to natural language).
2. Use IP-Adapter or character-consistency LoRAs to lock identity.
3. Cost: ~$0.01-0.05 per image on fal.ai or Replicate, so you can generate hundreds of candidates per coach cheaply.

**Fallback option 2: Higgsfield or PromeAI**

Newer tools specifically built for character consistency in creative workflows. Worth testing if Midjourney and Flux both underwhelm.

**Fallback option 3: commission a single real photography session as a reference**

Shoot one real person per coach with the general vibe, then use those images as `--cref` for Midjourney stylisation. Combines real-person reference with AI flexibility. Useful hybrid approach.

---

## Legal note

All AI-generated portraits carry some residual legal risk around accidental resemblance to real people. For the prototype and build phase this is acceptable. Before public launch, recommended mitigations:

- Do a reverse-image search on each final portrait to check it doesn't closely resemble any prominent real person.
- Consider commissioning proper photography (per earlier Path C discussion) for launch.
- Ensure your Terms of Service include disclaimers about the AI-generated nature of the coach characters.

---

*End of prompt library. Iterate, generate, test in HeyGen, and settle on your gold-standard six.*
