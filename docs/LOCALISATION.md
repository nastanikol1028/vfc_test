# Localisation checks

`npm run test:i18n` (with preview running) checks all generated routes in English and Chinese, including language round-trips, glossary tooltips, retained form input/files, localised legal downloads and the owner-confirmed company figures. External requests are blocked and no real forms are submitted.

Translations are reviewed in `src/js/data/translation-corrections.js`, loaded before the translation index is created. TU uses 技术条件, conformity declarations use 符合性声明, and FSB/KNB notifications refer explicitly to encryption products. Russian registration numbers may contain the literal Cyrillic prefix «ЕАЭС»; it must be preserved in instructions and entered identifiers.

Dynamic content translated before insertion records its original source in a runtime map. Do not rerender forms just to switch languages: user-entered values and attachments must remain intact. User filenames are not translated. Build-generated `.en.md` and `.zh.md` legal drafts correspond to the displayed language; draft status and unconfirmed infrastructure details remain unchanged.

The owner confirmed the accuracy of the experience and client figures. Their source is identified as company-provided, not independently audited. The homepage card styling and numeric values are preserved.
