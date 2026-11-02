const categoryIconDrawings = {
  box: '<path fill="#dcecf8" d="M17 32Q15 31 18 29L45 15Q48 13 51 15L78 29Q81 31 79 34V68Q79 71 76 73L51 86Q48 88 45 86L19 73Q16 71 16 68V34Z"/><path d="M17 32L48 49L79 32M48 49V86M33 22L64 39V53"/><path stroke="#7cadd2" d="M26 64L37 70M26 70L33 74"/>',
  jars: '<path fill="#dcecf8" d="M19 38H36Q43 38 43 46V77Q43 83 36 83H16Q10 83 10 77V46Q10 38 19 38Z"/><rect x="12" y="29" width="29" height="10" rx="3" fill="white"/><path d="M20 51H33M20 60H33" stroke="#85b4d7"/><path fill="#eaf4fb" d="M61 12H73V28Q73 32 78 36Q83 40 83 47V77Q83 83 77 83H57Q52 83 52 77V47Q52 40 57 36Q62 32 62 28V12Z"/><rect x="60" y="9" width="15" height="8" rx="2" fill="white"/><path d="M54 50H81V67H54" fill="white"/>',
  pouch:
    '<path fill="#dcecf8" d="M26 13H70Q72 13 72 17L77 77Q79 85 71 85H23Q15 85 17 77L22 17Q22 13 26 13Z"/><path d="M24 24H71M21 73Q48 68 74 73M30 16L32 24M62 16L60 24"/><rect x="31" y="37" width="32" height="24" rx="7" fill="white"/><path d="M39 45H55M40 52H52" stroke="#85b4d7"/>',
  bread:
    '<path fill="#dcecf8" d="M18 40Q8 34 13 25Q18 16 33 17Q48 6 63 17Q81 15 85 28Q88 36 78 41V75Q78 83 70 83H26Q18 83 18 75Z"/><path d="M28 43V70Q28 73 32 73H64Q68 73 68 70V43" stroke="#85b4d7"/><path d="M32 25Q39 21 44 22M51 22Q58 21 64 25" stroke="#85b4d7"/>',
  milk: '<path fill="#e9f3fb" d="M24 12H43V29Q43 33 49 38Q53 41 53 48V78Q53 84 47 84H20Q14 84 14 78V48Q14 41 19 37Q24 32 24 29Z"/><rect x="22" y="9" width="23" height="9" rx="3" fill="#dcecf8"/><path d="M16 48H51V66H16" fill="white"/><path fill="#dcecf8" d="M61 57L83 47Q87 45 87 50V79Q87 84 82 84H56V67Q56 61 61 57Z"/><path d="M58 65H87M67 73H68M77 76H78"/>',
  fish: '<path fill="#dcecf8" d="M12 48Q31 21 54 28Q68 31 77 42L88 29Q92 25 92 31V66Q92 72 88 68L77 55Q54 83 30 68Q18 60 12 48Z"/><path d="M36 31Q49 48 36 67M48 29L58 18Q62 16 66 30M50 69L60 79Q64 82 67 66"/><circle cx="28" cy="45" r="2.2" fill="#3278b8" stroke="none"/><path d="M7 79Q15 74 23 79M72 13Q80 9 87 13" stroke="#9ac2df"/>',
  cream:
    '<path fill="#dcecf8" d="M17 37H79V72Q79 81 69 81H27Q17 81 17 72Z"/><rect x="13" y="26" width="70" height="14" rx="6" fill="white"/><rect x="31" y="49" width="34" height="18" rx="6" fill="white"/><path d="M42 22Q51 16 46 10Q62 17 58 23" stroke="#85b4d7"/><path d="M40 57H56" stroke="#85b4d7"/>',
  shampoo:
    '<path fill="#dcecf8" d="M37 29H60Q70 29 70 41V75Q70 84 61 84H34Q25 84 25 75V41Q25 29 37 29Z"/><path d="M39 29V16H55V29M34 16H74Q79 16 79 23"/><path d="M39 50Q46 38 48 39Q60 54 55 60Q49 67 42 61Q35 57 39 50Z" fill="white"/><path d="M36 74H59" stroke="#85b4d7"/>',
  perfume:
    '<rect x="18" y="36" width="60" height="47" rx="12" fill="#dcecf8"/><path d="M37 36V26H59V36" fill="white"/><rect x="32" y="13" width="32" height="13" rx="4" fill="#e9f3fb"/><rect x="28" y="48" width="40" height="22" rx="6" fill="white"/><path d="M39 59H57M82 13V23M77 18H87" stroke="#85b4d7"/>',
  shirt:
    '<path fill="#dcecf8" d="M33 17Q30 17 26 20L12 27Q9 29 10 33L17 49Q19 52 22 50L29 46V78Q29 83 34 83H63Q68 83 68 78V46L75 50Q78 52 80 49L87 33Q89 29 85 27L70 20Q66 17 63 17Q61 30 48 30Q35 30 33 17Z"/><path d="M34 18Q35 39 48 39Q62 39 63 18M30 74H67" stroke="#85b4d7"/>',
  linen:
    '<rect x="16" y="20" width="64" height="19" rx="7" fill="#dcecf8"/><rect x="21" y="42" width="63" height="19" rx="7" fill="white"/><rect x="11" y="64" width="65" height="19" rx="7" fill="#dcecf8"/><path d="M27 29H70M32 51H74M22 73H66" stroke="#85b4d7"/>',
  fabric:
    '<path fill="#dcecf8" d="M29 20H68Q83 20 83 38V77Q83 82 77 82H30Q14 82 14 65V37Q14 20 29 20Z"/><ellipse cx="29" cy="37" rx="15" ry="17" fill="white"/><ellipse cx="29" cy="37" rx="6" ry="8"/><path d="M44 37H82M36 60Q58 55 78 61M33 72Q56 68 75 72" stroke="#85b4d7"/>',
  bag: '<path fill="#dcecf8" d="M24 32H72Q77 32 78 39L82 75Q83 83 75 83H21Q13 83 14 75L18 39Q19 32 24 32Z"/><path d="M33 34V25Q33 10 48 10Q63 10 63 25V34"/><path fill="white" d="M24 42H72V56Q72 66 48 66Q24 66 24 56Z"/><rect x="43" y="58" width="10" height="12" rx="3" fill="#b5d5ed"/>',
  carpet:
    '<path fill="#dcecf8" d="M27 20H66Q84 20 84 42Q84 64 66 64H27Z"/><ellipse cx="27" cy="42" rx="16" ry="22" fill="white"/><ellipse cx="27" cy="42" rx="7" ry="11"/><path fill="#eaf4fb" d="M39 58Q49 77 83 76V87H44Q35 82 32 63"/><path d="M46 79H69M49 84H74" stroke="#85b4d7"/>',
  curtain:
    '<path d="M9 13H87"/><path fill="#dcecf8" d="M17 15H39Q37 44 32 57Q24 72 17 82ZM57 15H79V82Q70 74 64 57Q58 42 57 15Z"/><path d="M27 18Q27 42 23 58M68 18Q68 42 73 58M18 59L33 54M63 54L78 59" stroke="#85b4d7"/><path d="M44 16V78M52 16V78" stroke="#b3d3e9"/>',
  blocks:
    '<circle cx="28" cy="23" r="10" fill="#dcecf8"/><circle cx="68" cy="23" r="10" fill="#dcecf8"/><ellipse cx="48" cy="59" rx="22" ry="25" fill="#dcecf8"/><circle cx="48" cy="31" r="23" fill="#eaf4fb"/><ellipse cx="48" cy="38" rx="11" ry="8" fill="white"/><circle cx="40" cy="28" r="2" fill="#3278b8" stroke="none"/><circle cx="56" cy="28" r="2" fill="#3278b8" stroke="none"/><path d="M46 35H50L48 39ZM48 39V43"/><ellipse cx="25" cy="57" rx="9" ry="14" transform="rotate(25 25 57)" fill="#eaf4fb"/><ellipse cx="71" cy="57" rx="9" ry="14" transform="rotate(-25 71 57)" fill="#eaf4fb"/><ellipse cx="33" cy="81" rx="12" ry="10" fill="white"/><ellipse cx="63" cy="81" rx="12" ry="10" fill="white"/>',
  baby: '<path fill="#dcecf8" d="M33 17Q30 17 27 20L15 26Q12 28 12 31L18 47Q19 50 23 48L29 44V61Q30 68 38 73L42 83H55L59 73Q67 68 68 61V44L74 48Q78 50 79 47L85 31Q86 28 82 26L69 20Q65 17 63 17Q60 30 48 30Q36 30 33 17Z"/><path d="M30 61Q48 66 67 61M39 74Q48 70 58 74"/><circle cx="48" cy="79" r="1.5" fill="#3278b8" stroke="none"/>',
  babybottle:
    '<path fill="#eaf4fb" d="M39 23V18Q39 7 48 7Q57 7 57 18V23"/><rect x="30" y="23" width="36" height="12" rx="5" fill="white"/><rect x="27" y="35" width="42" height="51" rx="13" fill="#dcecf8"/><path d="M55 46H67M58 56H67M55 66H67M37 48V72" stroke="#85b4d7"/>',
  machine:
    '<rect x="9" y="61" width="78" height="12" rx="4" fill="#dcecf8"/><path d="M17 73V84M79 73V84M18 59V27Q18 22 24 22H35Q40 22 40 27V61" fill="#eaf4fb"/><path d="M39 37H51L60 44 51 51H39M66 61V49Q66 45 70 45H79Q83 45 83 49V61M27 31V50"/><circle cx="28" cy="43" r="5" fill="white"/><path d="M58 61V53M50 53H66M73 45V32M67 32H79M46 77H67" stroke="#85b4d7"/>',
  pressure:
    '<rect x="13" y="43" width="70" height="30" rx="15" fill="#dcecf8"/><rect x="30" y="24" width="32" height="19" rx="5" fill="#eaf4fb"/><path d="M37 24V16H56V24M23 43V30H29M62 32H76V44"/><circle cx="28" cy="78" r="7" fill="white"/><circle cx="70" cy="78" r="7" fill="white"/><circle cx="72" cy="28" r="8" fill="white"/><path d="M72 28L76 24M24 56H65M84 57H91" stroke="#85b4d7"/>',
  factory:
    '<rect x="28" y="26" width="46" height="49" rx="10" fill="#dcecf8"/><ellipse cx="31" cy="50" rx="16" ry="23" fill="white"/><ellipse cx="31" cy="50" rx="8" ry="12" fill="#dcecf8"/><path d="M16 50H7M73 37H84V62H73M37 75V84M67 75V84M29 84H75M47 32V68M56 32V68M65 34V66"/><rect x="41" y="16" width="25" height="11" rx="3" fill="white"/>',
  laptop:
    '<rect x="16" y="16" width="65" height="47" rx="6" fill="#dcecf8"/><path fill="white" d="M16 63H81L91 78Q93 83 86 83H10Q3 83 6 78Z"/><path d="M26 26H71V53H26Z" fill="#f5faff"/><path d="M39 72H57M20 68H76" stroke="#85b4d7"/>',
  kettle:
    '<path fill="#dcecf8" d="M35 29H61Q66 29 67 36L74 69Q77 81 64 82H33Q22 81 25 69L29 48 14 36Q12 33 16 33H34Z"/><path d="M37 29V22Q37 17 42 17H58M68 36Q90 30 91 48Q91 66 73 66M25 86H77M47 41V65"/><path d="M43 50H51M43 58H51" stroke="#85b4d7"/>',
  electric:
    '<rect x="57" y="13" width="31" height="41" rx="8" fill="#dcecf8"/><circle cx="72" cy="32" r="10" fill="white"/><circle cx="68" cy="32" r="1.5" fill="#3278b8" stroke="none"/><circle cx="77" cy="32" r="1.5" fill="#3278b8" stroke="none"/><path d="M20 14V30M35 14V30"/><path fill="#eaf4fb" d="M15 30H40V43Q40 56 28 56Q15 56 15 43Z"/><path d="M28 56V68Q28 87 52 87Q73 87 73 67V55M15 38H40"/>',
  sofa: '<path fill="#dcecf8" d="M22 45V32Q22 23 31 23H66Q75 23 75 32V45"/><path fill="#eaf4fb" d="M14 43Q7 43 7 50V62Q7 71 16 71H80Q89 71 89 62V50Q89 43 82 43Q75 43 75 50V58H22V50Q22 43 14 43Z"/><path d="M18 71V81M78 71V81M48 25V58M23 59H74" stroke="#85b4d7"/>',
  bed: '<path d="M13 24V84M84 32V84"/><path fill="#dcecf8" d="M14 48H83V73H14Z"/><path d="M14 39Q14 31 24 31H60Q69 31 69 39V48M21 39H39Q45 39 45 47M14 65H83M24 49V64M36 49V64M48 49V64M60 49V64M72 49V64M14 78H83"/><path d="M77 17V25M73 21H81" stroke="#85b4d7"/>',
  desk: '<rect x="8" y="42" width="80" height="10" rx="3" fill="#dcecf8"/><path d="M17 52V84M80 52V84M57 52V76Q57 80 62 80H79M58 66H79"/><rect x="24" y="10" width="43" height="27" rx="4" fill="#eaf4fb"/><path d="M45 37V42M36 42H56M66 58H71M66 73H71M32 18H59" stroke="#85b4d7"/>',
  glove:
    '<path fill="#dcecf8" d="M29 80L14 55Q9 46 16 43Q20 41 25 48L32 57V25Q32 18 38 18Q44 18 44 25V42 17Q44 10 50 10Q56 10 56 17V43 23Q56 16 62 16Q68 16 68 23V45 33Q68 26 74 26Q80 26 80 33V62Q80 72 69 82Z"/><path d="M29 80L32 88H65L69 82M36 76H64" stroke="#85b4d7"/>',
  mask: '<path fill="#dcecf8" d="M19 34Q28 16 48 16Q69 16 78 34L74 62Q70 77 48 83Q26 77 22 62Z"/><path d="M20 36Q1 32 3 50Q4 69 23 62M77 36Q95 32 94 50Q93 68 74 62M33 24Q48 34 64 24"/><circle cx="48" cy="52" r="14" fill="white"/><path d="M42 47H54M40 53H56M43 59H53" stroke="#85b4d7"/>',
  workwear:
    '<path fill="#dcecf8" d="M34 15L18 22Q14 24 13 29L6 53Q5 57 10 59L21 62 28 42V80Q28 84 33 84H64Q69 84 69 80V42L76 62 87 59Q92 57 90 53L83 29Q82 24 78 22L63 15 48 27Z"/><path d="M48 27V84M34 16L40 35 48 27 56 35 63 16M28 52H69M30 59H42V72H30M55 59H67V72H55"/><path d="M11 43L24 47M73 47L86 43" stroke="#85b4d7"/>',
  detergent:
    '<path fill="#dcecf8" d="M32 20H57V30Q76 33 78 48V77Q78 85 69 85H25Q18 85 18 78V45Q18 32 32 29Z"/><rect x="29" y="11" width="31" height="12" rx="4" fill="white"/><path fill="white" d="M59 39Q68 39 68 48V58Q68 65 61 65H57V40Z"/><path d="M33 51Q22 64 33 71Q42 76 47 66Q50 61 38 49" fill="white"/>',
  spray:
    '<path fill="#dcecf8" d="M39 32H56V39Q56 43 63 47Q71 52 71 61V78Q71 85 64 85H31Q24 85 24 78V60Q24 52 32 47Q39 43 39 39Z"/><path fill="white" d="M31 12H76V24H57V32H39V24H31Z"/><path d="M57 24Q67 27 66 38M78 17H83M87 11L92 8M87 24L92 27"/><rect x="34" y="56" width="27" height="16" rx="5" fill="white"/>',
  bucket:
    '<path fill="#dcecf8" d="M19 36H78L72 76Q71 84 63 84H33Q25 84 24 76Z"/><path d="M26 36V29Q26 10 48 10Q71 10 71 29V36M18 36H79M23 47H75"/><path d="M36 59H62M38 68H59" stroke="#85b4d7"/><circle cx="84" cy="19" r="4" stroke="#85b4d7"/><circle cx="10" cy="24" r="3" stroke="#85b4d7"/>',
  plate:
    '<ellipse cx="39" cy="49" rx="31" ry="33" fill="#dcecf8"/><ellipse cx="39" cy="49" rx="21" ry="23" fill="white"/><path fill="#eaf4fb" d="M70 41H87V68Q87 77 79 77Q70 77 70 68Z"/><path d="M87 46Q98 45 97 55Q96 62 87 61M76 33Q71 29 76 23" stroke="#85b4d7"/>',
  pot: '<path fill="#dcecf8" d="M22 39H74V72Q74 81 65 81H31Q22 81 22 72Z"/><path d="M22 47H13Q7 47 7 53Q7 60 13 60H22M74 47H83Q89 47 89 53Q89 60 83 60H74M17 38H79M27 30Q47 14 69 30"/><path d="M43 23V17Q43 13 48 13Q53 13 53 17V23M32 49V68" stroke="#85b4d7"/>',
  vase: '<path fill="#dcecf8" d="M36 38H61Q54 55 67 66Q79 77 65 86H31Q17 77 29 66Q42 55 36 38Z"/><path d="M48 38V10M48 28Q26 28 24 11Q45 10 48 28ZM48 33Q68 34 73 18Q55 14 48 33Z" fill="white"/><path d="M35 74Q48 68 63 74" stroke="#85b4d7"/>',
  shoe: '<path fill="#dcecf8" d="M14 50L24 25Q27 20 32 23L45 31Q54 36 57 47L79 56Q89 60 89 70V74H12V63Q12 55 14 50Z"/><path fill="white" d="M12 70H89V78Q89 82 84 82H15Q9 82 9 77V73Q9 70 12 70Z"/><path d="M26 28Q22 42 29 45M36 37L45 33M42 44L52 40M48 51L59 47M18 62L32 56M21 76H34M69 76H79" stroke="#85b4d7"/>',
  childshoe:
    '<path fill="#dcecf8" d="M22 25Q21 20 27 20H45Q49 20 50 26L53 49 74 56Q85 60 85 70V75H15V60L22 25Z"/><path fill="white" d="M16 70H85V78Q85 83 78 83H20Q12 83 12 77V74Q12 70 16 70Z"/><path d="M23 36H49Q54 36 54 41Q54 46 49 46H22M21 51H52M24 76H35M67 76H76"/><path d="M66 21L69 28 77 29 71 35 72 43 65 39 59 43 60 35 55 29 63 28Z" fill="white" stroke="#85b4d7"/>',
};
const categoryIconMapping = {
  'packaging-1': 'box',
  'packaging-2': 'jars',
  'packaging-3': 'pouch',
  'food-1': 'bread',
  'food-2': 'milk',
  'food-3': 'fish',
  'beauty-1': 'cream',
  'beauty-2': 'shampoo',
  'beauty-3': 'perfume',
  'adult-clothes.webp': 'shirt',
  'home-textiles.webp': 'linen',
  'textile-materials.webp': 'fabric',
  'textile-4': 'bag',
  'textile-5': 'carpet',
  'textile-6': 'curtain',
  'children-1': 'blocks',
  'children-2': 'baby',
  'children-3': 'babybottle',
  'equipment-1': 'machine',
  'equipment-2': 'pressure',
  'equipment-3': 'factory',
  'electronics-1': 'laptop',
  'electronics-2': 'kettle',
  'electronics-3': 'electric',
  'furniture-1': 'sofa',
  'furniture-2': 'bed',
  'furniture-3': 'desk',
  'protection-1': 'glove',
  'protection-2': 'mask',
  'protection-3': 'workwear',
  'chemicals-1': 'detergent',
  'chemicals-2': 'spray',
  'chemicals-3': 'bucket',
  'dishes-1': 'plate',
  'dishes-2': 'pot',
  'dishes-3': 'vase',
  'footwear-1': 'shoe',
  'footwear-2': 'childshoe',
  'footwear-3': 'bag',
};
