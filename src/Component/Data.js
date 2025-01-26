// data.js

// Function to return room options
export const getRoomOptions = () => ['1', '2', '3', '4', '5', '+6'];

// Function to return bathroom options
export const getBathroomOptions = () => ['1', '2', '3', '4', '5', '+6'];

// Function to return furnished options
export const getFurnishedOptions = (lang) => [
  `${lang === 'ar' ? 'مفروشة' : ' Furnished'}`,
  `${lang === 'ar' ? 'غير مفروشة' : ' Unfurnished'}`,
  `${lang === 'ar' ? 'مفروش جزيئاً' : ' Partially furnished'}`,
];

// Function to return features
export const getFeatures = () => [
  { id: 'central-air-conditioning', en: 'Central air conditioning', ar: 'تكييف مركزي' },
  { id: 'conditioning', en: 'Conditioning', ar: 'تكييف' },
  { id: 'heating', en: 'Heating', ar: 'تدفئة' },
  { id: 'balcony', en: 'Balcony', ar: 'شرفة / بلكونة' },
  { id: 'maids-room', en: 'Maids room', ar: 'غرفة خادمة' },
  { id: 'laundry-room', en: 'Laundry room', ar: 'غرفة غسيل' },
  { id: 'wall-cabinets', en: 'Wall cabinets', ar: 'خزائن حائط' },
  { id: 'private-pool', en: 'Private pool', ar: 'مسبح خاص' },
  { id: 'solar-heater', en: 'Solar heater', ar: 'سخان شمسي' },
  { id: 'jacuzzi', en: 'Jacuzzi', ar: 'جاكوزي' },
  { id: 'double-glazed-windows', en: 'Double glazed windows', ar: 'زجاج شبابيك مزدوج' },
  { id: 'ready-kitchen', en: 'Ready kitchen', ar: 'مطبخ جاهز' },
  { id: 'electric-lampshade', en: 'Electric lampshade', ar: 'اباجورت كهرباء' },
  { id: 'underfloor-heating', en: 'Underfloor heating', ar: 'تدفئة تحت البلاط' },
  { id: 'washing-machine', en: 'Washing machine', ar: 'غسالة' },
  { id: 'dishwasher', en: 'Dishwasher', ar: 'جلاية صحون' },
  { id: 'microwave', en: 'Microwave', ar: 'مايكرويف' },
  { id: 'oven', en: 'Oven', ar: 'فرن' },
  { id: 'fridge', en: 'Fridge', ar: 'ثلاجة' }
];

// Function to return additional features
export const getAdditionalFeatures = () => [
  { id: 'elevator', en: 'Elevator', ar: 'مصعد' },
  { id: 'garden', en: 'Garden', ar: 'حديقة' },
  { id: 'parking', en: 'Parking', ar: 'موقف سيارات' },
  { id: 'security', en: 'Guard / Security and Protection', ar: 'حارس / أمن وحماية' },
  { id: 'staircase', en: 'Staircase', ar: 'درج' },
  { id: 'store', en: 'Store', ar: 'مخزن' },
  { id: 'bbq', en: 'BBQ', ar: 'منطقة شواء' },
  { id: 'backup-power', en: 'Emergency backup power system', ar: 'نظام كهرباء احتياطي للطوارئ' },
  { id: 'swimming-pool', en: 'Swimming pool', ar: 'بركة سباحة' },
  { id: 'intercom', en: 'Intercom', ar: 'انتركم' },
  { id: 'internet', en: 'Internet', ar: 'انترنت' },
  { id: 'disabled-facilities', en: 'Facilities for people with disabilities', ar: 'تسهيلات لأصحاب الهمم' }
];

// Function to return interface options
export const getInterfaceOptions = (lang) => [
  `${lang === 'ar' ? 'شمالية' : ' Northern'}`,
  `${lang === 'ar' ? 'جنوبية' : ' Southern'}`,
  `${lang === 'ar' ? 'شرقية' : 'Eastern'}`,
  `${lang === 'ar' ? 'غربية' : 'Western'}`,
  `${lang === 'ar' ? 'شمالية شرقية' : 'Northeast'}`,
  `${lang === 'ar' ? 'شمالية غربية' : 'Northwest'}`,
  `${lang === 'ar' ? 'جنوبية شرقية' : 'southeast'}`,
  `${lang === 'ar' ? 'جنوبية غربية' : 'Southwest'}`,
];
export const getFamilyOptions = () => ['1', '2', '3', '4', '5', '+6'];
export const getkitchenOptions = () => ['1', '2', '3', '+4'];
export const getswimmingpoolsOptions = () => ['1', '2', '+3'];
