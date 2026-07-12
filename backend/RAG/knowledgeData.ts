export interface KnowledgeDoc {
  id?: number | string;
  crop: string;
  topic: string;
  content: string;
  source: string;
  embedding?: number[];
}

export const VERIFIED_AGRO_KNOWLEDGE: KnowledgeDoc[] = [
  // ─── WHEAT (गहूँ) ───
  {
    crop: "Wheat",
    topic: "Disease Management - Yellow Rust (Puccinia striiformis)",
    content: `Wheat Yellow Rust / Stripe Rust Symptoms & Treatment:
- Symptoms: Yellow, stripe-like pustules arranged along leaf veins on wheat leaves. Yellow powder rubs off on fingers. Common in Northern India (Punjab, Haryana, Western UP) during cold, humid weather.
- Chemical Treatment (ICAR Approved): Spray Propiconazole 25% EC (Tilt) @ 1 ml per litre of water (200 ml in 200 litres of water per acre) or Tebuconazole 25.9% EC @ 1 ml per litre.
- Preventive Measure: Use resistant varieties like HD-3086, DBW-187, DBW-222, PBW-725. Avoid excess nitrogen fertilizer as it encourages fungal spread.`,
    source: "ICAR-Indian Institute of Wheat and Barley Research (IIWBR)"
  },
  {
    crop: "Wheat",
    topic: "Pest Management - Armyworm & Aphids",
    content: `Wheat Pest Management (Armyworm & Green Aphids):
- Armyworm Control: Spray Chlorpyrifos 20% EC @ 2 ml/litre or Quinalphos 25% EC @ 2 ml/litre in the evening when larvae feed actively.
- Aphid Control: If aphid population exceeds 10-15 per earhead/tiller at heading stage, spray Thiamethoxam 25% WG @ 0.5 g/litre (50 g per acre) or Imidacloprid 17.8% SL @ 0.5 ml/litre.
- Biological Control: Conserve ladybird beetles and spray 5% Neem Seed Kernel Extract (NSKE).`,
    source: "ICAR / Punjab Agricultural University (PAU)"
  },
  {
    crop: "Wheat",
    topic: "Fertilizer Schedule & Dosage (NPK)",
    content: `Wheat Fertilizer Management per Acre (Standard Irrigated Conditions):
- Nitrogen (N): 50-60 kg/acre (approx. 110-130 kg Urea).
- Phosphorus (P2O5): 24 kg/acre (approx. 50 kg DAP).
- Potash (K2O): 16 kg/acre (approx. 25-30 kg MOP).
- Application Schedule: Apply full dose of DAP and MOP with 1/3rd Urea at sowing (basal dose). Apply remaining 2/3rd Urea split equally at 1st irrigation (Crown Root Initiation stage, 21 days) and 2nd irrigation (Jointing/Tillering stage, 45 days).
- Micronutrients: Spray Zinc Sulphate (21%) @ 0.5% + 2.5% Urea if yellowing of leaves occurs due to zinc deficiency.`,
    source: "ICAR Crop Production Guide"
  },
  {
    crop: "Wheat",
    topic: "Critical Irrigation Stages",
    content: `Wheat Critical Irrigation Schedule:
1. Crown Root Initiation (CRI) stage: 20-25 days after sowing (Most Critical - never skip).
2. Tillering stage: 40-45 days after sowing.
3. Late Jointing / Stem elongation stage: 60-65 days after sowing.
4. Flowering stage: 80-85 days after sowing.
5. Milk / Dough stage: 100-105 days after sowing.
- Note: Avoid flood irrigation during windy days at late stages to prevent crop lodging (falling over).`,
    source: "ICAR Directorate of Wheat Research"
  },

  // ─── RICE / PADDY (धान) ───
  {
    crop: "Rice",
    topic: "Disease Management - Rice Blast & Bacterial Leaf Blight",
    content: `Rice Blast (Magnaporthe oryzae) & Bacterial Leaf Blight (BLB):
- Rice Blast Symptoms: Spindle-shaped/diamond-shaped spots with grey-white centres and brown margins on leaves.
- Blast Treatment: Spray Tricyclazole 75% WP @ 0.6 g/litre (120 g/acre) or Isoprothiolane 40% EC @ 1.5 ml/litre or Kasugamycin 3% SL @ 2 ml/litre.
- Bacterial Leaf Blight (BLB) Treatment: Spray Streptocycline @ 0.1 g/litre (6 g in 60 litres water per acre) mixed with Copper Oxychloride 50% WP @ 2.5 g/litre. Drain excess field water.`,
    source: "ICAR-National Rice Research Institute (NRRI)"
  },
  {
    crop: "Rice",
    topic: "Pest Management - Brown Plant Hopper (BPH) & Stem Borer",
    content: `Rice Stem Borer (Dead Heart / White Earhead) & Brown Plant Hopper (BPH):
- Yellow Stem Borer: Apply Cartap Hydrochloride 4% G @ 10 kg/acre or spray Chlorantraniliprole 18.5% SC (Coragen) @ 0.3 ml/litre (60 ml/acre) at 15-20 days after transplanting.
- Brown Plant Hopper (BPH) / 'Hopper Burn': Direct spray to the base of the plant using Pymetrozine 50% WG @ 0.6 g/litre (120 g/acre) or Triflumezopyrim 10% SC @ 0.5 ml/litre (94 ml/acre). Avoid synthetic pyrethroids as they cause BPH resurgence.`,
    source: "ICAR-Indian Institute of Rice Research (IIRR)"
  },
  {
    crop: "Rice",
    topic: "Fertilizer Schedule & Water Management",
    content: `Paddy / Rice Fertilizer Schedule per Acre:
- Basal Dose: 50 kg DAP + 30 kg MOP + 10 kg Zinc Sulphate (33%) per acre at the time of final puddling.
- Urea Application (Total 90-100 kg Urea): Split into 3 equal doses:
  1. 1/3rd at 7-10 days after transplanting (DAT).
  2. 1/3rd at active tillering stage (25-30 DAT).
  3. 1/3rd at panicle initiation stage (45-50 DAT).
- Alternate Wetting and Drying (AWD): Save up to 30% water by irrigating 2-3 days after ponded water disappears.`,
    source: "ICAR-NRRI Cuttack"
  },

  // ─── COTTON (कपास) ───
  {
    crop: "Cotton",
    topic: "Pest Management - Pink Bollworm & Whitefly",
    content: `Cotton Pink Bollworm & Whitefly Management:
- Pink Bollworm (Pectinophora gossypiella): Install pheromone traps @ 5 per acre for monitoring. If catches exceed 8 moths/trap/night for 3 consecutive days, spray Emamectin Benzoate 5% SG @ 0.5 g/litre (100 g/acre) or Profenofos 50% EC @ 2 ml/litre (400 ml/acre).
- Whitefly & Cotton Leaf Curl Virus: Spray Diafenthiuron 50% WP @ 1.2 g/litre or Pyriproxyfen 10% EC @ 2 ml/litre. For organic deterrence, spray 5% Neem oil (Azadirachtin 1500 ppm @ 3 ml/litre).`,
    source: "ICAR-Central Institute for Cotton Research (CICR)"
  },
  {
    crop: "Cotton",
    topic: "Nutrient & Boll Shedding Management",
    content: `Cotton Nutrient Management & Boll Rot Prevention:
- Fertilizer per Acre: 45 kg Nitrogen, 20 kg Phosphorus, 20 kg Potassium. Apply Phosphorus and Potash as basal, Nitrogen split into 3-4 top dressings at squaring, flowering, and boll development.
- Preventing Square/Boll Dropping: Foliar spray of Planofix (Alpha Naphthyl Acetic Acid) @ 0.25 ml per 4.5 litres of water (4.5 ml in 100 litres water) at peak flowering stage.
- Micronutrient Foliar Spray: Spray 1% Magnesium Sulphate + 0.5% Zinc Sulphate + 0.2% Boron at 60 and 90 days after sowing.`,
    source: "ICAR-CICR Nagpur"
  },

  // ─── MUSTARD (सरसों) ───
  {
    crop: "Mustard",
    topic: "Disease - White Rust & Aphid Management",
    content: `Mustard White Rust (Albugo candida) & Mustard Aphid Control:
- White Rust: White creamy pustules on lower leaf surface and staghead malformation in flowers. Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2 g/litre (400 g/acre). Repeat after 15 days if needed.
- Mustard Aphid (Lipaphis erysimi): When aphid infestation reaches economic threshold (50 aphids/plant on 10 cm terminal shoot), spray Dimethoate 30% EC (Rogor) @ 1.7 ml/litre or Oxydemeton-methyl 25% EC @ 1.5 ml/litre in afternoon after pollinator activity ceases.`,
    source: "ICAR-Directorate of Rapeseed-Mustard Research (DRMR)"
  },

  // ─── PULSES / GRAM (चना / दालें) ───
  {
    crop: "Gram / Chickpea",
    topic: "Pod Borer (Helicoverpa armigera) & Wilt Disease",
    content: `Gram Pod Borer & Fusarium Wilt Management:
- Pod Borer Control: Install 'T' shaped bird perches @ 20/acre. Spray NPV (Nuclear Polyhedrosis Virus) @ 100 LE/acre or Emamectin Benzoate 5% SG @ 80 g/acre (0.4 g/litre) or Chlorantraniliprole 18.5% SC @ 50 ml/acre at early larval stage.
- Fusarium Wilt: Seed treatment with Trichoderma viride @ 5-10 g/kg seed or Carbendazim 50% WP @ 2 g/kg seed before sowing. Avoid deep sowing in heavy soils.`,
    source: "ICAR-Indian Institute of Pulses Research (IIPR)"
  },

  // ─── SUGARCANE (गन्ना) ───
  {
    crop: "Sugarcane",
    topic: "Red Rot Disease & Early Shoot Borer",
    content: `Sugarcane Red Rot (Colletotrichum falcatum) & Shoot Borer:
- Red Rot Symptoms: Third and fourth leaf from top turn yellow, stalks show reddish discoloration internally with horizontal white patches. Foul alcoholic smell upon splitting cane.
- Red Rot Management: Plant disease-free setts from certified seed nurseries. Treat setts with Carbendazim 50% WP (0.1% solution) for 15 minutes before planting. Uproot and burn affected clumps immediately.
- Early Shoot Borer (Chilo infuscatellus): Spray Chlorantraniliprole 18.5% SC @ 150 ml in 400 litres of water per acre along cane furrows at 30-45 days after planting.`,
    source: "ICAR-Indian Institute of Sugarcane Research (IISR)"
  },

  // ─── ORGANIC & BIO-PESTICIDES ───
  {
    crop: "General Crops",
    topic: "Organic Pest Control - Neem, Jeevamrut & Dashaparni Ark",
    content: `Organic Pest & Disease Management Formulas (ICAR/Zero Budget Natural Farming):
- Neem Oil Formulation: Mix 5 ml pure Cold-Pressed Neem Oil (min 1500 ppm Azadirachtin) with 1 ml liquid soap/detergent in 1 litre water. Shake thoroughly before spraying. Effective against sucking pests, whitefly, aphids, and jassids.
- Jeevamrut (Soil Booster): Mix 10 kg native cow dung + 10 litres cow urine + 2 kg jaggery + 2 kg pulse flour (besan) + handful of farm soil in 200 litres water. Ferment for 48-72 hours. Apply 200 litres per acre through irrigation water.
- Dashaparni Ark: Extract of 10 herbal leaves (Neem, Karanj, Calotropis, Custard apple, Datura, Papaya, Marigold, Guava, Nerium, Castor) boiled with cow urine and garlic. Dilute 5 litres in 200 litres water per acre against persistent caterpillars and borer larvae.`,
    source: "National Centre for Organic and Natural Farming (NCONF) / ICAR"
  }
];
