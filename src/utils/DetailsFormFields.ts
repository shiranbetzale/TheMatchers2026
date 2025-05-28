import { FormField } from "./FormFields.type";
import { calculateAge, getDateBefore } from "./generalFunction";

const detailsFormArray: FormField[] = [
    {
        id: "id",
        text: "תעודת זהות:",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        collapseTitle: "פרטים אישיים",
    },
    {
        id: "fullName",
        text: "שם מלא:",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "gender",
        text: "מגדר:",
        options: [
            { id: 1, name: "gender", label: "זכר" },
            { id: 2, name: "gender", label: "נקבה" }
        ],
        fieldType: "radioButton",
        handlePress: () => { },
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "birthDateHe",
        text: "תאריך לידה עברי:",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "birthDate",
        text: "תאריך לידה לועזי:",
        fieldType: "datePicker",
        maxDate: getDateBefore(18),
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "age",
        text: "גיל:",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        isEditable: false,
        defaultValue: calculateAge(new Date),
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "hight",
        text: "גובה:",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "city",
        text: "עיר מגורים:",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "status",
        text: "סטטוס:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "status", label: "רווק/ה" },
            { id: 2, name: "status", label: "אלמן/ה" },
            { id: 3, name: "status", label: "גרוש/ה" },
            { id: 4, name: "status", label: "אלמן/ה +" },
            { id: 5, name: "status", label: "גרוש/ה +" }
        ],
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "countOfChildren",
        text: "מספר ילדים:",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        condition: [
            { fieldId: "status", value: "4" },
            { fieldId: "status", value: "5" }
        ],
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "countOfChildren",
        text: "הסדרי שהות?",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        condition: [
            { fieldId: "status", value: "5" }
        ],
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "typeOfHeadCover",
        text: "כיסוי ראש:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            {
                id: 1, name: "typeOfHeadCover", label: "כיפה שחורה", isShow: [
                    { fieldId: "gender", value: "1" }
                ]
            },
            {
                id: 2, name: "typeOfHeadCover", label: "כיפה סרוגה", isShow: [
                    { fieldId: "gender", value: "1" }
                ]
            },
            {
                id: 3, name: "typeOfHeadCover", label: "מטפחת", isShow: [
                    { fieldId: "gender", value: "2" }
                ]
            },
            {
                id: 4, name: "typeOfHeadCover", label: "פאה", isShow: [
                    { fieldId: "gender", value: "2" }
                ]
            },
            {
                id: 5, name: "typeOfHeadCover", label: "מטפחת ופאה", isShow: [
                    { fieldId: "gender", value: "2" }
                ]
            },
        ],
        collapseTitle: "פרטים אישיים"
    },
    {
        id: "phone",
        text: "טלפון:",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        collapseTitle: "פרטי קשר"
    },
    {
        id: "typeOfPhone",
        text: "סוג נייד:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "typeOfPhone", label: "כשר" },
            { id: 2, name: "typeOfPhone", label: "מוגן" },
            { id: 3, name: "typeOfPhone", label: "לא מוגן" }
        ],
        collapseTitle: "פרטי קשר"
    },
    {
        id: "mail",
        text: "מייל:",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטי קשר"
    },
    {
        id: "hashkafa",
        text: "השקפה:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "hashkafa", label: "דתי/ה" },
            { id: 2, name: "hashkafa", label: "חרדי/ת" },
            { id: 3, name: "hashkafa", label: "חרדי/ת מודרני/ת" },
            { id: 4, name: "hashkafa", label: "חוזר/ת בתשובה" }
        ],
        collapseTitle: "סגנון"
    },
    {
        id: "hozerBitshoveAge",
        text: "מאיזה גיל חוזר בתשובה?",
        keyboardTypeOption: "numeric",
        fieldType: "input",
        condition: [
            { fieldId: "hashkafa", value: "4" },
        ],
        collapseTitle: "סגנון"
    },
    {
        id: "isGer",
        text: "מעוניין/ת בגר/ת צדק?",
        fieldType: "switch",
        collapseTitle: "סגנון"
    },
    {
        id: "isHozerBitshuva",
        text: "מעוניין/ת בחוזר/ת בתשובה?",
        fieldType: "switch",
        collapseTitle: "סגנון"
    },
    {
        id: "isStayInCurrentLocation",
        text: "מעוניין/ת להשאר ולגור בעיר מגוריי?",
        fieldType: "switch",
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "isSmoker",
        text: "מעשן/ת?",
        fieldType: "switch",
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "isHasDrivingLicense",
        text: "רישיון נהיגה?",
        fieldType: "switch",
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "isCohen",
        text: "את/ה כהן/ת?",
        fieldType: "switch",
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "zerem",
        text: "זרם:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "zerem", label: "חסיד" },
            { id: 2, name: "zerem", label: "ליטאי" },
            { id: 3, name: "zerem", label: "עדות המזרח" }
        ],
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "hasidut",
        text: "זרם חסידות?",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "zerem", value: "1" }
        ],
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "tribe",
        text: "עדה?",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "zerem", value: "3" }
        ],
        collapseTitle: "פרטים כלליים"
    },
    {
        id: "highSchoolName",
        text: "שם של תיכון:",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "gender", value: "2" }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "seminarName",
        text: "שם של סמינר:",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "gender", value: "2" }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "whatWorks",
        text: "עיסוק",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            {
                id: 1,
                name: "whatWorks",
                label: "בחור ישיבה",
                isShow: [
                    { fieldId: "gender", value: "1" }
                ]
            },
            {
                id: 2,
                name: "whatWorks",
                label: "אברך",
                isShow: [
                    { fieldId: "gender", value: "1" }
                ]
            },
            {
                id: 3,
                name: "whatWorks",
                label: "עובד/ת"
            },
            {
                id: 4,
                name: "whatWorks",
                label: "סטודנט/ית - לימודים אקדמיים"
            },
            {
                id: 5,
                name: "whatWorks",
                label: "חצי עובד/ת חצי לומד/ת - אקדמאי/ת"
            },
            {
                id: 6,
                name: "whatWorks",
                label: "חצי עובד חצי לומד",
                isShow: [
                    { fieldId: "gender", value: "1" }
                ]
            },
            {
                id: 7,
                name: "whatWorks",
                label: "בצבא",
                isShow: [
                    { fieldId: "gender", value: "1" }
                ]
            },
            {
                id: 8,
                name: "whatWorks",
                label: "שירות לאומי",
                isShow: [
                    { fieldId: "gender", value: "2" }
                ]
            }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "isServedInArmy",
        text: "שירתת בצבא?",
        fieldType: "switch",
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "isNationalService",
        text: "שירתת בשירות לאומי?",
        fieldType: "switch",
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "smallYeshiva",
        text: "ישיבה קטנה:",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "whatWorks", value: "1" },
            { fieldId: "gender", value: "1" }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "BigYeshiva",
        text: "ישיבה גדולה:",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "gender", value: "1" },
            { fieldId: "whatWorks", value: "1" },
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "kibutz",
        text: "קיבוץ:",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "whatWorks", value: "1" },
            { fieldId: "gender", value: "1" }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "colel",
        text: "כולל:",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "gender", value: "1" },
            { fieldId: "whatWorks", value: "2" },
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "nameOfWork",
        text: "במה עובד/ת?",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "whatWorks", value: "3" },
            { fieldId: "whatWorks", value: "5" },
            { fieldId: "whatWorks", value: "6" }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "whatLearning",
        text: "מה לומד/ת?",
        keyboardTypeOption: "default",
        fieldType: "input",
        condition: [
            { fieldId: "whatWorks", value: "4" },
            { fieldId: "whatWorks", value: "5" }
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "education",
        text: "השכלה:",
        fieldType: "checkbox",
        handlePress: () => console.log(),
        options: [
            {
                id: 1,
                name: "education",
                label: "תואר"
            },
            {
                id: 2,
                name: "education",
                label: "הנדסאי/ת"
            },
            {
                id: 3,
                name: "education",
                label: "בגרות",
            },
            {
                id: 4,
                name: "education",
                label: "ישיבה",
                isShow: [
                    { fieldId: "gender", value: "1" },
                    { fieldId: "whatWorks", value: "1" },
                ]
            },
            {
                id: 5,
                name: "education",
                label: "12 שנות לימוד",
            },
        ],
        collapseTitle: "עיסוק והשכלה"
    },
    {
        id: "bodyStructure",
        text: "מבנה גוף:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "bodyStructure", label: "רזה" },
            { id: 2, name: "bodyStructure", label: "בריא/ה" },
            { id: 3, name: "bodyStructure", label: "מלא/ה" }
        ],
        collapseTitle: "מראה חיצוני"
    },
    {
        id: "skinColor",
        text: "צבע עור:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "skinColor", label: "בהיר/ה" },
            { id: 2, name: "skinColor", label: "ממוצע - לא כהה ולא בהיר/ה" },
            { id: 3, name: "skinColor", label: "כהה" }
        ],
        collapseTitle: "מראה חיצוני"
    },
    {
        id: "beardType",
        text: "סוג זקן:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "beardType", label: "זקן - שלא נגעו בו" },
            { id: 2, name: "beardType", label: "זקן - מסודר" },
            { id: 3, name: "beardType", label: "זיפים" },
            { id: 4, name: "beardType", label: "מגולח" }
        ],
        condition: [
            { fieldId: "gender", value: "1" }
        ],
        collapseTitle: "מראה חיצוני"
    },
    {
        id: "clothes",
        text: "לבוש:",
        fieldType: "select",
        handlePress: () => console.log(),
        options: [
            { id: 1, name: "clothes", label: "שחור לבן" },
            { id: 2, name: "clothes", label: "צבעוני" },
            { id: 3, name: "clothes", label: "צבעוני ובשבת שחור לבן" }
        ],
        condition: [
            { fieldId: "gender", value: "1" }
        ],
        collapseTitle: "מראה חיצוני"
    },
    {
        id: "fatherName",
        text: "שם של האבא:",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטים נוספים"
    },
    {
        id: "motherName",
        text: "שם של האמא:",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטים נוספים"
    },
    {
        id: "rabbiName",
        text: "מי הרב שלי?",
        keyboardTypeOption: "default",
        fieldType: "input",
        collapseTitle: "פרטים נוספים"
    },
    {
        id: "importantInfo",
        text: "קצת עלי...",
        keyboardTypeOption: "default",
        fieldType: "input",
        isMultiline: true,
        collapseTitle: "פרטים נוספים"
    },
    {
        id: "familyInfo",
        text: "קצת על המשפחה",
        keyboardTypeOption: "default",
        fieldType: "input",
        isMultiline: true,
        collapseTitle: "פרטים נוספים"
    },
    {
        id: "phonesForInquiries",
        text: "טלפונים לברורים:",
        keyboardTypeOption: "default",
        fieldType: "input",
        isMultiline: true,
        collapseTitle: "פרטים נוספים"
    },
];

export default detailsFormArray;
