import {
  BrewInput,
  BrewRecipe,
  BrewStep,
  GrindSetting,
  CoffeeProcess,
  RoastProfile,
  GrinderModel,
  WaterSource,
  TargetProfile,
} from '@/types/brewing';

/**
 * Calculates optimal water to coffee ratio based on roast profile,
 * target taste profile, and brew method.
 */
function calculateRatio(
  method: 'Hot' | 'Ice',
  roast: RoastProfile,
  target: TargetProfile
): number {
  if (method === 'Hot') {
    // Hot V60 base ratio
    let baseRatio = 15.5;
    if (roast === 'Light') baseRatio = 16.0;
    else if (roast === 'Light-Medium') baseRatio = 15.5;
    else if (roast === 'Medium') baseRatio = 15.0;
    else if (roast === 'Dark') baseRatio = 14.5;

    // Target profile adjustment
    if (target === 'Balance & Clean') baseRatio += 0.0;
    else if (target === 'More Sweetness') baseRatio -= 0.5; // Slightly denser extraction
    else if (target === 'More Acidity') baseRatio += 0.5; // Stretched ratio enhances clarity and fruit notes
    else if (target === 'More Body') baseRatio -= 0.5; // Shorter ratio for higher TDS and mouthfeel

    // Clamp within 1:14.0 to 1:16.6
    return Math.max(14.0, Math.min(16.6, Number(baseRatio.toFixed(1))));
  } else {
    // Ice V60 (Japanese Iced) total liquid ratio
    let baseRatio = 15.0;
    if (roast === 'Light') baseRatio = 15.5;
    else if (roast === 'Light-Medium') baseRatio = 15.0;
    else if (roast === 'Medium') baseRatio = 14.5;
    else if (roast === 'Dark') baseRatio = 14.0;

    if (target === 'More Sweetness') baseRatio -= 0.5;
    else if (target === 'More Acidity') baseRatio += 0.5;
    else if (target === 'More Body') baseRatio -= 0.5;

    return Math.max(13.5, Math.min(16.0, Number(baseRatio.toFixed(1))));
  }
}

/**
 * Calculates water temperature in Celsius based on roast, process,
 * target flavor, and water mineral profile.
 */
function calculateWaterTemperature(
  roast: RoastProfile,
  process: CoffeeProcess,
  target: TargetProfile,
  water: WaterSource
): number {
  let temp = 92;

  // Base by roast profile
  switch (roast) {
    case 'Light':
      temp = 93;
      break;
    case 'Light-Medium':
      temp = 91;
      break;
    case 'Medium':
      temp = 89;
      break;
    case 'Dark':
      temp = 84;
      break;
  }

  // Adjust for processing method
  if (process === 'Anaerobic Fermentation' || process === 'Experimental') {
    temp -= 2; // Fragile volatile aromatic compounds, avoids harsh fermentation taste
  } else if (process === 'Natural' || process === 'Honey') {
    temp -= 1; // High natural sugars can scorch or over-extract quickly
  }

  // Adjust for target flavor profile
  if (target === 'More Acidity' && (roast === 'Light' || roast === 'Light-Medium')) {
    temp += 1; // Highlights crisp organic acids
  } else if (target === 'More Sweetness') {
    temp -= 1; // Smooth thermal profile to bring out rich sweet notes
  }

  // Adjust for water source mineral content (TDS heuristics)
  if (water === 'Cleo' || water === 'RO Water') {
    // Very low TDS (<15 ppm), slightly higher thermal energy compensates for lower mineral extraction
    temp += 1;
  } else if (water === 'Le Minerale') {
    // High TDS (~170 ppm with calcium and magnesium), extracts aggressively
    temp -= 1;
  }

  // Clamp within realistic V60 range
  return Math.max(82, Math.min(95, temp));
}

/**
 * Calculates grinder clicks and recommended particle size
 */
function calculateGrindSetting(
  grinder: GrinderModel,
  roast: RoastProfile,
  process: CoffeeProcess,
  method: 'Hot' | 'Ice'
): GrindSetting {
  const isIce = method === 'Ice';
  const isFinesProducer = process === 'Anaerobic Fermentation' || process === 'Experimental' || process === 'Natural';

  switch (grinder) {
    case 'Timemore C2/C3': {
      let clicks = 15;
      if (roast === 'Light') clicks = 14;
      else if (roast === 'Light-Medium') clicks = 15;
      else if (roast === 'Medium') clicks = 16;
      else if (roast === 'Dark') clicks = 18;

      if (isFinesProducer) clicks += 1;
      if (isIce) clicks -= 1; // Finer grind for faster iced contact time

      return {
        grinderName: 'Timemore C2 / C3',
        clicksOrSetting: `${clicks} Klik`,
        micronDescription: 'Medium-Fine (~600 - 750 μm)',
        adjustmentNote: isIce
          ? 'Sedikit lebih halus dari biasanya untuk memaksimalkan ekstraksi konsentrat panas.'
          : isFinesProducer
          ? 'Dinaikkan 1 klik untuk mencegah clogging akibat partikel halus (fines).'
          : 'Setting standar pour over V60 yang seimbang.',
      };
    }

    case 'Comandante C40': {
      let clicks = 21;
      if (roast === 'Light') clicks = 20;
      else if (roast === 'Light-Medium') clicks = 21;
      else if (roast === 'Medium') clicks = 23;
      else if (roast === 'Dark') clicks = 25;

      if (isFinesProducer) clicks += 1;
      if (isIce) clicks -= 2;

      return {
        grinderName: 'Comandante C40 MK3/MK4',
        clicksOrSetting: `${clicks} Clicks`,
        micronDescription: 'Medium (~650 - 800 μm)',
        adjustmentNote: isIce
          ? 'Set pada rentang fine-medium untuk rasio air panas yang lebih sedikit.'
          : 'Distribusi partikel sangat seragam, ideal untuk kejernihan rasa dan keasaman bersih.',
      };
    }

    case 'Kingrinder K6': {
      let clicks = 90;
      if (roast === 'Light') clicks = 85;
      else if (roast === 'Light-Medium') clicks = 88;
      else if (roast === 'Medium') clicks = 92;
      else if (roast === 'Dark') clicks = 98;

      if (isFinesProducer) clicks += 4;
      if (isIce) clicks -= 5;

      const rotations = (clicks / 60).toFixed(1);
      return {
        grinderName: 'Kingrinder K6',
        clicksOrSetting: `${clicks} Klik (~${rotations} putaran)`,
        micronDescription: 'Medium-Fine (~650 - 750 μm)',
        adjustmentNote: '1 putaran lengkap sama dengan 60 klik dari titik nol kalibrasi.',
      };
    }

    case '1Zpresso Q2/JX-Pro': {
      let q2Clicks = 20;
      let jxClicks = 34;

      if (roast === 'Light') {
        q2Clicks = 18;
        jxClicks = 32;
      } else if (roast === 'Dark') {
        q2Clicks = 22;
        jxClicks = 38;
      }

      if (isIce) {
        q2Clicks -= 1;
        jxClicks -= 2;
      }

      return {
        grinderName: '1Zpresso Q2 / JX-Pro',
        clicksOrSetting: `Q2: ${q2Clicks} klik | JX-Pro: ${jxClicks} nomor (${(jxClicks / 10).toFixed(1)} rotasi)`,
        micronDescription: 'Medium-Fine (~650 - 750 μm)',
        adjustmentNote: 'Cocok untuk aliran V60 yang stabil tanpa menumpuk fines di dasar filter.',
      };
    }

    case 'Fellow Ode': {
      let setting = 4.1;
      if (roast === 'Light') setting = 3.2;
      else if (roast === 'Light-Medium') setting = 4.1;
      else if (roast === 'Medium') setting = 5.0;
      else if (roast === 'Dark') setting = 6.0;

      if (isIce) setting -= 0.3;
      if (isFinesProducer) setting += 0.3;

      return {
        grinderName: 'Fellow Ode (Gen 2 Burrs)',
        clicksOrSetting: `Setting ${setting.toFixed(1)}`,
        micronDescription: 'Medium-Fine (~600 - 700 μm)',
        adjustmentNote: 'Flat burr memberikan ekstraksi manis dan kejernihan notes buah yang tinggi.',
      };
    }

    case 'Generic':
    default: {
      return {
        grinderName: 'Grinder Standar / Manual Lainnya',
        clicksOrSetting: isIce ? 'Medium-Fine (Garam Dapur)' : 'Medium (Pasir Halus Pantai)',
        micronDescription: '~650 - 800 μm',
        adjustmentNote: 'Jika aliran air terlalu lambat (>3:15), kasarkan 1-2 step pada seduhan berikutnya.',
      };
    }
  }
}

/**
 * Creates step-by-step pouring instructions with timing, water increments,
 * and pouring techniques.
 */
function calculatePouringSteps(
  dose: number,
  hotWater: number,
  method: 'Hot' | 'Ice',
  target: TargetProfile
): { steps: BrewStep[]; estimatedTime: string; totalSeconds: number } {
  const steps: BrewStep[] = [];

  if (method === 'Hot') {
    // 4-step pouring structure (Bloom + 3 Pours)
    const bloomWater = Math.round(dose * 3); // Bloom ~3x dose (e.g. 45ml for 15g)
    const remainingWater = hotWater - bloomWater;

    let pour1Water: number;
    let pour2Water: number;
    let pour3Water: number;

    if (target === 'More Sweetness') {
      // Larger initial pour for sugar extraction
      pour1Water = Math.round(remainingWater * 0.4);
      pour2Water = Math.round(remainingWater * 0.35);
      pour3Water = remainingWater - pour1Water - pour2Water;
    } else if (target === 'More Acidity') {
      // Split into more balanced early stages
      pour1Water = Math.round(remainingWater * 0.35);
      pour2Water = Math.round(remainingWater * 0.35);
      pour3Water = remainingWater - pour1Water - pour2Water;
    } else if (target === 'More Body') {
      // 2 heavier main pours
      pour1Water = Math.round(remainingWater * 0.45);
      pour2Water = Math.round(remainingWater * 0.35);
      pour3Water = remainingWater - pour1Water - pour2Water;
    } else {
      // Balance & Clean
      pour1Water = Math.round(remainingWater * 0.36);
      pour2Water = Math.round(remainingWater * 0.34);
      pour3Water = remainingWater - pour1Water - pour2Water;
    }

    // Step 1: Bloom
    steps.push({
      stepNumber: 1,
      name: 'Bloom (Pemekaran Kopi)',
      waterAmount: bloomWater,
      cumulativeWater: bloomWater,
      startTimeSeconds: 0,
      endTimeSeconds: 45,
      timeRangeFormatted: '00:00 - 00:45',
      technique: 'Spiral pour perlahan dari tengah keluar, basahi seluruh bubuk kopi merata.',
      note: 'Lepaskan gas CO2 dari kopi agar ekstraksi berikutnya maksimal. Goyangkan (swirl) server 1x perlahan jika perlu.',
    });

    // Step 2: Pour 1 (Acidity & Sweetness)
    const cum1 = bloomWater + pour1Water;
    steps.push({
      stepNumber: 2,
      name: 'Pour 1 (Ekstraksi Asam & Manis)',
      waterAmount: pour1Water,
      cumulativeWater: cum1,
      startTimeSeconds: 45,
      endTimeSeconds: 75,
      timeRangeFormatted: '00:45 - 01:15',
      technique: 'Tuang melingkar stabil dengan laju aliran air lembut dan tidak terlalu tinggi dari coffee bed.',
      note: 'Jaga ketinggian air tetap stabil di dalam dripper V60.',
    });

    // Step 3: Pour 2 (Body & Density)
    const cum2 = cum1 + pour2Water;
    steps.push({
      stepNumber: 3,
      name: 'Pour 2 (Pembentukan Body)',
      waterAmount: pour2Water,
      cumulativeWater: cum2,
      startTimeSeconds: 75,
      endTimeSeconds: 110,
      timeRangeFormatted: '01:15 - 01:50',
      technique: 'Spiral pour sedang mengarah keluar lalu kembali ke tengah.',
      note: 'Pertahankan suhu seduhan di dalam filter basket agar tidak anjlok.',
    });

    // Step 4: Pour 3 (Clarity & Finishing Drawdown)
    const cum3 = cum2 + pour3Water;
    steps.push({
      stepNumber: 4,
      name: 'Pour 3 (Penyelesaian & Kejernihan)',
      waterAmount: pour3Water,
      cumulativeWater: cum3,
      startTimeSeconds: 110,
      endTimeSeconds: 140,
      timeRangeFormatted: '01:50 - 02:20',
      technique: 'Center pour lembut di bagian tengah dengan agitasi minimal.',
      note: 'Biarkan air turun tuntas (drawdown). Kopi siap disajikan ketika tetesan melambat.',
    });

    return {
      steps,
      estimatedTime: '02:30 - 02:45 menit',
      totalSeconds: 165,
    };
  } else {
    // Ice V60 (Japanese Iced Pour Over)
    // 3 focused pours over ice carafe
    const bloomWater = Math.round(dose * 2.8);
    const remainingHot = hotWater - bloomWater;
    const pour1Water = Math.round(remainingHot * 0.52);
    const pour2Water = remainingHot - pour1Water;

    // Step 1: Bloom
    steps.push({
      stepNumber: 1,
      name: 'Hot Bloom (Pemekaran Kopi Panas)',
      waterAmount: bloomWater,
      cumulativeWater: bloomWater,
      startTimeSeconds: 0,
      endTimeSeconds: 40,
      timeRangeFormatted: '00:00 - 00:40',
      technique: 'Tuang melingkar cepat dan merata dengan air panas.',
      note: 'Pastikan seluruh bubuk terbasahi. Konsentrat pertama akan mulai menetes ke es di server.',
    });

    // Step 2: Pour 1 (Konsentrasi Ekstraksi)
    const cum1 = bloomWater + pour1Water;
    steps.push({
      stepNumber: 2,
      name: 'Pour 1 (Ekstraksi Konsentrat)',
      waterAmount: pour1Water,
      cumulativeWater: cum1,
      startTimeSeconds: 40,
      endTimeSeconds: 75,
      timeRangeFormatted: '00:40 - 01:15',
      technique: 'Spiral pour perlahan dengan aliran air fokus agar ekstraksi padat.',
      note: 'Es di dalam server akan mencair secara bertahap dan mengunci aroma aromatik kopi.',
    });

    // Step 3: Pour 2 (Finishing Pour Panas)
    const cum2 = cum1 + pour2Water;
    steps.push({
      stepNumber: 3,
      name: 'Pour 2 (Penyelesaian Seduhan Panas)',
      waterAmount: pour2Water,
      cumulativeWater: cum2,
      startTimeSeconds: 75,
      endTimeSeconds: 105,
      timeRangeFormatted: '01:15 - 01:45',
      technique: 'Tuang di tengah secara halus hingga target air panas tercapai.',
      note: 'Tunggu drawdown selesai tuntas pada menit 01:55 - 02:10.',
    });

    return {
      steps,
      estimatedTime: '02:00 - 02:15 menit',
      totalSeconds: 135,
    };
  }
}

/**
 * Generates insightful explanation and brewing tips based on input variables.
 */
function generateExplanations(
  input: BrewInput,
  recipeRatio: number,
  temp: number
): { explanation: string; waterNote: string; tips: string[] } {
  const parts: string[] = [];

  // Roast & Process rationale
  if (input.process === 'Anaerobic Fermentation' || input.process === 'Experimental') {
    parts.push(
      `Proses ${input.process} menghasilkan profil rasa buah yang intens dan fermentatif. Suhu disetel pada ${temp}°C dengan rasio 1:${recipeRatio} untuk menjaga aftertaste tetap bersih dan mencegah nada pahit alkoholik.`
    );
  } else if (input.process === 'Natural' || input.process === 'Honey') {
    parts.push(
      `Proses ${input.process} memiliki kandungan gula alami yang tinggi. Profil ekstraksi dioptimalkan untuk menonjolkan sweetness dan fruit notes yang bulat.`
    );
  } else {
    parts.push(
      `Proses Washed memberikan karakter cup yang jernih dan sparkling acidity. Rasio 1:${recipeRatio} dipilih untuk menonjolkan clean finish khas varietas ${input.variety}.`
    );
  }

  // Roast profile rationale
  if (input.roastProfile === 'Light') {
    parts.push(
      `Roast profile Light membutuhkan air bersuhu ${temp}°C untuk memaksimalkan pelarutan senyawa aromatik bunga & buah segar.`
    );
  } else if (input.roastProfile === 'Dark') {
    parts.push(
      `Roast profile Dark diekstraksi pada suhu moderat ${temp}°C untuk mengekstrak aroma dark chocolate dan caramel tanpa memicu rasa pahit pekat.`
    );
  }

  // Water source note
  let waterNote = '';
  switch (input.waterSource) {
    case 'Cleo':
      waterNote =
        'Cleo (TDS ~0-5 ppm): Air sangat murni tanpa mineral. Menghasilkan rasa yang sangat tajam dan terang (high acidity), sedikit menonjolkan notes buah.';
      break;
    case 'RO Water':
      waterNote =
        'RO Water (TDS ~10-25 ppm): Ekstraksi sangat bersih dengan kejernihan maksimal. Sedikit menaikkan suhu membantu efisiensi ekstraksi.';
      break;
    case 'Le Minerale':
      waterNote =
        'Le Minerale (TDS ~160-180 ppm): Kaya mineral kalsium dan magnesium alami. Ekstraksi lebih kuat, menghasilkan body tebal dan rasa manis yang dominan.';
      break;
    case 'Aqua':
      waterNote =
        'Aqua (TDS ~90-120 ppm): Mineral seimbang standar Indonesia. Menghasilkan profil seduhan yang balance antara rasa asam, manis, dan body.';
      break;
    case 'Custom Mineral Water':
      waterNote =
        'Custom Mineral Water (TDS ~120-150 ppm): Formulasi optimal specialty coffee. Memberikan kejernihan aroma tertinggi dan body yang velvety.';
      break;
  }

  const tips: string[] = [
    'Bilas kertas filter V60 dengan air panas sebelum memasukkan bubuk kopi untuk menghilangkan bau kertas.',
    input.method === 'Ice'
      ? 'Pastikan es batu dimasukkan ke dalam server terlebih dahulu sebelum proses tuang dimulai.'
      : 'Ratakan permukaan bubuk kopi (tap pelan dripper) sebelum memulai pour pertama.',
    'Tuang air dengan ketinggian corong kettle sekitar 8 - 12 cm di atas bed kopi agar arus air lembut dan tidak mengoyak filter.',
  ];

  return {
    explanation: parts.join(' '),
    waterNote,
    tips,
  };
}

/**
 * Main dynamic recommendation engine function
 */
export function calculateBrewRecipe(input: BrewInput): BrewRecipe {
  const ratio = calculateRatio(input.method, input.roastProfile, input.targetProfile);
  const totalWater = Math.round(input.dose * ratio);

  let hotWater = totalWater;
  let iceAmount = 0;

  if (input.method === 'Ice') {
    // 40% ice in server, 60% hot water through dripper
    iceAmount = Math.round(totalWater * 0.4);
    hotWater = totalWater - iceAmount;
  }

  const waterTemperature = calculateWaterTemperature(
    input.roastProfile,
    input.process,
    input.targetProfile,
    input.waterSource
  );

  const grindSetting = calculateGrindSetting(
    input.grinder,
    input.roastProfile,
    input.process,
    input.method
  );

  const { steps, estimatedTime, totalSeconds } = calculatePouringSteps(
    input.dose,
    hotWater,
    input.method,
    input.targetProfile
  );

  const { explanation, waterNote, tips } = generateExplanations(
    input,
    ratio,
    waterTemperature
  );

  return {
    input,
    ratio,
    ratioFormatted: `1:${ratio}`,
    dose: input.dose,
    totalWater,
    hotWater,
    iceAmount,
    waterTemperature,
    grindSetting,
    estimatedBrewTime: estimatedTime,
    totalBrewTimeSeconds: totalSeconds,
    steps,
    flavorNotesExplanation: explanation,
    waterAdjustmentNote: waterNote,
    brewerTips: tips,
  };
}
