export type Language = "en" | "hi";

export interface TranslationDictionary {
  nav: {
    home: string;
    features: string;
    solutions: string;
    pricing: string;
    calculators: string;
    fundExplorer: string;
    testimonials: string;
    blog: string;
    contact: string;
    payOnline: string;
    login: string;
  };
  hero: {
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badgeText: string;
  };
  callback: {
    heading: string;
    subheading: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    arnPlaceholder: string;
    cityPlaceholder: string;
    submitButton: string;
    successMessage: string;
  };
  stats: {
    aumTracked: string;
    activeAdvisors: string;
    monthlyOrders: string;
    uptime: string;
  };
  common: {
    requestDemo: string;
    callUs: string;
    emailUs: string;
    investSmarter: string;
    rightsReserved: string;
    disclaimer: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      home: "Home",
      features: "Features",
      solutions: "Solutions",
      pricing: "Pricing",
      calculators: "Calculators",
      fundExplorer: "Fund Explorer",
      testimonials: "Testimonials",
      blog: "Blog",
      contact: "Contact",
      payOnline: "Pay Online",
      login: "Login",
    },
    hero: {
      badgeText: "Enterprise SaaS for Mutual Fund Distributors",
      titlePrefix: "Empower Your Advisory Firm with",
      titleHighlight: "Institutional Wealth Tech",
      subtitle: "Give your investors a bank-grade branded web portal and mobile app. Automate BSE StarMF & NSE NMF transactions, CAS mailback reconciliation, and trail commission accounting.",
      ctaPrimary: "Schedule Live Demo",
      ctaSecondary: "Explore 12 Features",
    },
    callback: {
      heading: "Request a Call Back",
      subheading: "Speak with a Senior Wealth Tech Consultant today.",
      namePlaceholder: "Your Full Name",
      phonePlaceholder: "Mobile Number (10 digits)",
      arnPlaceholder: "ARN Number (e.g. ARN-189420)",
      cityPlaceholder: "City (e.g. Mumbai)",
      submitButton: "Request Priority Call",
      successMessage: "Thank you! Our advisory specialist will call you within 15 minutes.",
    },
    stats: {
      aumTracked: "₹18,500+ Cr AUM Tracked",
      activeAdvisors: "2,400+ MFDs & Advisors",
      monthlyOrders: "4.8 Lakh+ Monthly Orders",
      uptime: "99.99% Guaranteed Uptime",
    },
    common: {
      requestDemo: "Book a Demo",
      callUs: "Call Advisory Desk",
      emailUs: "Email Support",
      investSmarter: "Invest Smarter. Grow Together.",
      rightsReserved: "All rights reserved.",
      disclaimer: "Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing.",
    },
  },
  hi: {
    nav: {
      home: "होम",
      features: "सुविधाएं",
      solutions: "समाधान",
      pricing: "मूल्य निर्धारण",
      calculators: "कैलकुलेटर",
      fundExplorer: "फंड एक्सप्लोरर",
      testimonials: "प्रशंसापत्र",
      blog: "ब्लॉग",
      contact: "संपर्क करें",
      payOnline: "ऑनलाइन भुगतान",
      login: "लॉगिन",
    },
    hero: {
      badgeText: "म्यूचुअल फंड वितरकों के लिए एंटरप्राइज SaaS",
      titlePrefix: "अपनी वित्तीय सलाहकार फर्म को दें",
      titleHighlight: "संस्थागत वेल्थ टेक की शक्ति",
      subtitle: "अपने निवेशकों को अपने ब्रांड का आधुनिक वेब पोर्टल और मोबाइल ऐप दें। BSE StarMF और NSE NMF ऑर्डर, CAS सुलह और ट्रेल कमीशन का पूर्ण स्वचालन।",
      ctaPrimary: "लाइव डेमो शेड्यूल करें",
      ctaSecondary: "12 मुख्य सुविधाएं देखें",
    },
    callback: {
      heading: "कॉल बैक का अनुरोध करें",
      subheading: "हमारे वरिष्ठ वेल्थ टेक विशेषज्ञ से अभी बात करें।",
      namePlaceholder: "आपका पूरा नाम",
      phonePlaceholder: "मोबाइल नंबर (10 अंक)",
      arnPlaceholder: "ARN नंबर (उदा. ARN-189420)",
      cityPlaceholder: "शहर (उदा. मुंबई)",
      submitButton: "प्राथमिकता कॉल अनुरोध",
      successMessage: "धन्यवाद! हमारे सलाहकार विशेषज्ञ 15 मिनट में आपसे संपर्क करेंगे।",
    },
    stats: {
      aumTracked: "₹18,500+ करोड़ AUM प्रबंधित",
      activeAdvisors: "2,400+ MFDs एवं सलाहकार",
      monthlyOrders: "4.8 लाख+ मासिक ऑर्डर्स",
      uptime: "99.99% सिस्टम अपटाइम",
    },
    common: {
      requestDemo: "डेमो बुक करें",
      callUs: "कॉल करें",
      emailUs: "ईमेल सहायता",
      investSmarter: "स्मार्ट निवेश। साझा विकास।",
      rightsReserved: "सर्वाधिकार सुरक्षित।",
      disclaimer: "म्यूचुअल फंड निवेश बाजार के जोखिमों के अधीन हैं। निवेश से पहले योजना से जुड़े सभी दस्तावेजों को ध्यानपूर्वक पढ़ें।",
    },
  },
};

