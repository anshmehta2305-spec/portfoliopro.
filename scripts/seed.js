const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Portfolio Pro database with realistic wealth management data...');

  // Clean existing data in reverse order of foreign keys
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.auditLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.sIP.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.holding.deleteMany();
  await prisma.client.deleteMany();
  await prisma.navHistory.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.demoBooking.deleteMany();
  await prisma.callbackRequest.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Roles & Core Accounts: 1 Admin, 2 Distributors, 5 Clients + Organization roles
  const usersToCreate = [
    // 1 Super Admin
    {
      email: 'admin@portfoliopro.in',
      name: 'Siddharth Mehta (Super Admin)',
      role: 'ADMIN',
      phone: '+91 99887 76655',
      arnCode: 'ARN-MASTER-01',
    },
    // Distributor 1
    {
      email: 'advisor@portfoliopro.in',
      name: 'Vikramaditya Singhania',
      role: 'ADVISOR',
      phone: '+91 98110 54321',
      arnCode: 'ARN-189420',
    },
    // Distributor 2
    {
      email: 'advisor2@portfoliopro.in',
      name: 'Priya Agarwal (Apex Wealth)',
      role: 'ADVISOR',
      phone: '+91 98200 98765',
      arnCode: 'ARN-234567',
    },
    // Additional organizational roles
    {
      email: 'corporate@portfoliopro.in',
      name: 'Apex Capital Advisors Pvt Ltd',
      role: 'CORPORATE',
      phone: '+91 22 6677 8899',
      arnCode: 'ARN-90214',
    },
    {
      email: 'employee@portfoliopro.in',
      name: 'Pooja Iyer (Operations Lead)',
      role: 'EMPLOYEE',
      phone: '+91 97690 98765',
      arnCode: null,
    },
    {
      email: 'subbroker@portfoliopro.in',
      name: 'Maheshwari Wealth Partners',
      role: 'SUB_BROKER',
      phone: '+91 98450 67890',
      arnCode: 'ARN-189420-SB01',
    },
    {
      email: 'branch@portfoliopro.in',
      name: 'BKC Central Branch Office',
      role: 'BRANCH',
      phone: '+91 22 4001 2233',
      arnCode: 'ARN-189420-BKC',
    },
    {
      email: 'rm@portfoliopro.in',
      name: 'Amitav Deshmukh (Sr. RM)',
      role: 'RM',
      phone: '+91 98212 34567',
      arnCode: null,
    },
    // 5 Clients
    {
      email: 'investor@portfoliopro.in',
      name: 'Rajesh Sharma',
      role: 'INVESTOR',
      phone: '+91 98201 12345',
      arnCode: null,
    },
    {
      email: 'ananya.sen@client.in',
      name: 'Ananya Sen',
      role: 'INVESTOR',
      phone: '+91 98300 23456',
      arnCode: null,
    },
    {
      email: 'rohan.gupta@client.in',
      name: 'Rohan Gupta',
      role: 'INVESTOR',
      phone: '+91 98111 34567',
      arnCode: null,
    },
    {
      email: 'meera.nair@client.in',
      name: 'Meera Nair',
      role: 'INVESTOR',
      phone: '+91 98470 45678',
      arnCode: null,
    },
    {
      email: 'vikram.joshi@client.in',
      name: 'Vikram Joshi',
      role: 'INVESTOR',
      phone: '+91 98222 56789',
      arnCode: null,
    },
  ];

  const createdUserMap = {};
  for (const u of usersToCreate) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        passwordHash: defaultPassword,
        role: u.role,
        phone: u.phone,
        arnCode: u.arnCode,
        isActive: true,
      },
    });
    createdUserMap[u.email] = user;
  }
  console.log(`✓ Created ${usersToCreate.length} Users (1 Admin, 2 Distributors, 5 Clients, 5 Institutional)`);

  // 2. Realistic Mutual Funds
  const fundsData = [
    {
      amfiCode: '119551',
      name: 'HDFC Top 100 Fund - Direct Growth',
      category: 'Large Cap',
      amc: 'HDFC Mutual Fund',
      nav: 1120.45,
      navDate: '30-Oct-2026',
      oneYearReturn: 28.4,
      threeYearReturn: 19.8,
      fiveYearReturn: 17.2,
      expenseRatio: 1.05,
      aumCrores: 34500.5,
      riskLevel: 'Very High',
    },
    {
      amfiCode: '120503',
      name: 'ICICI Prudential Bluechip Fund - Direct Growth',
      category: 'Large Cap',
      amc: 'ICICI Prudential Mutual Fund',
      nav: 104.82,
      navDate: '30-Oct-2026',
      oneYearReturn: 26.2,
      threeYearReturn: 18.5,
      fiveYearReturn: 16.9,
      expenseRatio: 0.98,
      aumCrores: 56210.0,
      riskLevel: 'Very High',
    },
    {
      amfiCode: '125497',
      name: 'SBI Focused Equity Fund - Direct Growth',
      category: 'Flexi Cap',
      amc: 'SBI Mutual Fund',
      nav: 342.15,
      navDate: '30-Oct-2026',
      oneYearReturn: 29.1,
      threeYearReturn: 21.4,
      fiveYearReturn: 18.6,
      expenseRatio: 0.89,
      aumCrores: 31200.0,
      riskLevel: 'Very High',
    },
    {
      amfiCode: '120716',
      name: 'Nippon India Small Cap Fund - Direct Growth',
      category: 'Small Cap',
      amc: 'Nippon India Mutual Fund',
      nav: 184.95,
      navDate: '30-Oct-2026',
      oneYearReturn: 42.8,
      threeYearReturn: 32.1,
      fiveYearReturn: 27.5,
      expenseRatio: 0.76,
      aumCrores: 52180.0,
      riskLevel: 'Very High',
    },
    {
      amfiCode: '120847',
      name: 'Mirae Asset Large & Midcap Fund - Direct Growth',
      category: 'Large & Mid Cap',
      amc: 'Mirae Asset Mutual Fund',
      nav: 158.32,
      navDate: '30-Oct-2026',
      oneYearReturn: 31.6,
      threeYearReturn: 22.3,
      fiveYearReturn: 20.1,
      expenseRatio: 0.65,
      aumCrores: 39400.0,
      riskLevel: 'Very High',
    },
    {
      amfiCode: '119062',
      name: 'Kotak Balanced Advantage Fund - Direct Growth',
      category: 'Hybrid',
      amc: 'Kotak Mahindra Mutual Fund',
      nav: 22.84,
      navDate: '30-Oct-2026',
      oneYearReturn: 19.2,
      threeYearReturn: 14.8,
      fiveYearReturn: 13.5,
      expenseRatio: 0.55,
      aumCrores: 16800.0,
      riskLevel: 'Moderate',
    },
    {
      amfiCode: '119132',
      name: 'Aditya Birla Sun Life Liquid Fund - Direct Growth',
      category: 'Liquid',
      amc: 'Aditya Birla Sun Life MF',
      nav: 388.92,
      navDate: '30-Oct-2026',
      oneYearReturn: 7.2,
      threeYearReturn: 6.8,
      fiveYearReturn: 6.2,
      expenseRatio: 0.22,
      aumCrores: 44200.0,
      riskLevel: 'Low',
    },
  ];

  const createdFunds = [];
  for (const f of fundsData) {
    const fund = await prisma.fund.create({ data: f });
    createdFunds.push(fund);
  }
  console.log(`✓ Created ${createdFunds.length} Core Mutual Funds`);

  // 3. Create 5 Clients: 3 assigned to Distributor 1 (ARN-189420), 2 to Distributor 2 (ARN-234567)
  const clientConfigs = [
    {
      email: 'investor@portfoliopro.in',
      name: 'Rajesh Sharma',
      pan: 'ABCPS1234F',
      phone: '+91 98201 12345',
      kycStatus: 'VERIFIED',
      riskProfile: 'GROWTH_ORIENTED',
      assignedAdvisor: 'ARN-189420',
      totalAum: 4850000.0,
      totalCost: 3620000.0,
      xirr: 21.4,
      holdings: [
        { fundIdx: 0, folio: 'HDFC/9821440/22', units: 1250.45, avgNav: 850.2, invested: 1063132.0, current: 1401066.0, xirr: 22.8 },
        { fundIdx: 3, folio: 'NIPPON/441299/01', units: 8200.0, avgNav: 120.5, invested: 988100.0, current: 1516590.0, xirr: 34.2 },
        { fundIdx: 4, folio: 'MIRAE/77102/98', units: 7200.5, avgNav: 110.0, invested: 792055.0, current: 1140023.0, xirr: 24.1 },
        { fundIdx: 5, folio: 'KOTAK/1209/44', units: 34685.0, avgNav: 18.5, invested: 641672.0, current: 792205.0, xirr: 15.6 },
      ],
      sips: [
        { fundIdx: 0, folio: 'HDFC/9821440/22', amount: 25000.0, date: 5, mandateId: 'BSE_MAND_99410' },
        { fundIdx: 3, folio: 'NIPPON/441299/01', amount: 15000.0, date: 10, mandateId: 'BSE_MAND_99411' },
      ],
      transactions: [
        { scheme: 'HDFC Top 100 Fund - Direct Growth', type: 'SIP', amount: 25000, units: 22.31, nav: 1120.45, date: '05-Oct-2026', status: 'SUCCESS' },
        { scheme: 'Nippon India Small Cap Fund - Direct Growth', type: 'SIP', amount: 15000, units: 81.1, nav: 184.95, date: '10-Oct-2026', status: 'SUCCESS' },
        { scheme: 'Mirae Asset Large & Midcap Fund - Direct Growth', type: 'PURCHASE', amount: 100000, units: 631.63, nav: 158.32, date: '24-Sep-2026', status: 'SUCCESS' },
      ],
      goals: [
        { title: 'Comfortable Retirement Corpus', category: 'RETIREMENT', target: 50000000, current: 2850000, year: 2040, sip: 45000 },
        { title: 'Aanya Higher Education', category: 'EDUCATION', target: 15000000, current: 2000000, year: 2033, sip: 25000 },
      ],
    },
    {
      email: 'ananya.sen@client.in',
      name: 'Ananya Sen',
      pan: 'BPKPS5678G',
      phone: '+91 98300 23456',
      kycStatus: 'VERIFIED',
      riskProfile: 'AGGRESSIVE',
      assignedAdvisor: 'ARN-189420',
      totalAum: 2750000.0,
      totalCost: 2100000.0,
      xirr: 26.8,
      holdings: [
        { fundIdx: 3, folio: 'NIPPON/88219/11', units: 8500.0, avgNav: 135.0, invested: 1147500.0, current: 1572075.0, xirr: 31.2 },
        { fundIdx: 2, folio: 'SBI/55120/43', units: 3442.8, avgNav: 276.6, invested: 952500.0, current: 1177925.0, xirr: 22.5 },
      ],
      sips: [
        { fundIdx: 3, folio: 'NIPPON/88219/11', amount: 30000.0, date: 7, mandateId: 'BSE_MAND_88124' },
      ],
      transactions: [
        { scheme: 'Nippon India Small Cap Fund - Direct Growth', type: 'SIP', amount: 30000, units: 162.2, nav: 184.95, date: '07-Oct-2026', status: 'SUCCESS' },
        { scheme: 'SBI Focused Equity Fund - Direct Growth', type: 'PURCHASE', amount: 200000, units: 584.54, nav: 342.15, date: '15-Sep-2026', status: 'SUCCESS' },
      ],
      goals: [
        { title: 'Early Financial Independence (FIRE)', category: 'RETIREMENT', target: 30000000, current: 2750000, year: 2035, sip: 60000 },
      ],
    },
    {
      email: 'rohan.gupta@client.in',
      name: 'Rohan Gupta',
      pan: 'CRJPG9012H',
      phone: '+91 98111 34567',
      kycStatus: 'PENDING',
      riskProfile: 'CONSERVATIVE',
      assignedAdvisor: 'ARN-189420',
      totalAum: 850000.0,
      totalCost: 800000.0,
      xirr: 8.5,
      holdings: [
        { fundIdx: 6, folio: 'ABSL/11209/77', units: 1285.6, avgNav: 380.0, invested: 488528.0, current: 500000.0, xirr: 7.1 },
        { fundIdx: 5, folio: 'KOTAK/99812/03', units: 15323.9, avgNav: 20.3, invested: 311072.0, current: 350000.0, xirr: 10.2 },
      ],
      sips: [
        { fundIdx: 6, folio: 'ABSL/11209/77', amount: 10000.0, date: 1, mandateId: 'BSE_MAND_77312' },
      ],
      transactions: [
        { scheme: 'Aditya Birla Sun Life Liquid Fund - Direct Growth', type: 'PURCHASE', amount: 500000, units: 1285.6, nav: 388.92, date: '01-Oct-2026', status: 'SUCCESS' },
      ],
      goals: [
        { title: 'Emergency Contingency Fund', category: 'EMERGENCY', target: 1200000, current: 850000, year: 2027, sip: 15000 },
      ],
    },
    // Distributor 2's Clients (ARN-234567)
    {
      email: 'meera.nair@client.in',
      name: 'Meera Nair',
      pan: 'DZMPS3456K',
      phone: '+91 98470 45678',
      kycStatus: 'VERIFIED',
      riskProfile: 'MODERATE',
      assignedAdvisor: 'ARN-234567',
      totalAum: 3900000.0,
      totalCost: 3100000.0,
      xirr: 18.2,
      holdings: [
        { fundIdx: 1, folio: 'ICICI/44918/33', units: 19080.3, avgNav: 85.0, invested: 1621825.0, current: 2000000.0, xirr: 17.5 },
        { fundIdx: 4, folio: 'MIRAE/33918/02', units: 12001.0, avgNav: 123.1, invested: 1478175.0, current: 1900000.0, xirr: 19.1 },
      ],
      sips: [
        { fundIdx: 1, folio: 'ICICI/44918/33', amount: 20000.0, date: 15, mandateId: 'BSE_MAND_44192' },
      ],
      transactions: [
        { scheme: 'ICICI Prudential Bluechip Fund - Direct Growth', type: 'SIP', amount: 20000, units: 190.8, nav: 104.82, date: '15-Oct-2026', status: 'SUCCESS' },
        { scheme: 'Mirae Asset Large & Midcap Fund - Direct Growth', type: 'REDEMPTION', amount: 50000, units: 315.8, nav: 158.32, date: '12-Aug-2026', status: 'SUCCESS' },
      ],
      goals: [
        { title: 'Bangalore Villa Down Payment', category: 'HOME', target: 8000000, current: 3900000, year: 2029, sip: 50000 },
      ],
    },
    {
      email: 'vikram.joshi@client.in',
      name: 'Vikram Joshi',
      pan: 'EXKPJ7890L',
      phone: '+91 98222 56789',
      kycStatus: 'VERIFIED',
      riskProfile: 'AGGRESSIVE',
      assignedAdvisor: 'ARN-234567',
      totalAum: 6200000.0,
      totalCost: 4800000.0,
      xirr: 24.5,
      holdings: [
        { fundIdx: 0, folio: 'HDFC/77124/88', units: 2498.9, avgNav: 890.0, invested: 2224021.0, current: 2800000.0, xirr: 21.0 },
        { fundIdx: 3, folio: 'NIPPON/66190/55', units: 18383.3, avgNav: 140.1, invested: 2575979.0, current: 3400000.0, xirr: 28.1 },
      ],
      sips: [
        { fundIdx: 0, folio: 'HDFC/77124/88', amount: 40000.0, date: 20, mandateId: 'BSE_MAND_66191' },
      ],
      transactions: [
        { scheme: 'HDFC Top 100 Fund - Direct Growth', type: 'SIP', amount: 40000, units: 35.7, nav: 1120.45, date: '20-Oct-2026', status: 'SUCCESS' },
        { scheme: 'HDFC Top 100 Fund - Direct Growth', type: 'SWITCH', amount: 150000, units: 133.8, nav: 1120.45, date: '18-Aug-2026', status: 'SUCCESS' },
      ],
      goals: [
        { title: 'Global Wealth Hedging & Retirement', category: 'RETIREMENT', target: 80000000, current: 6200000, year: 2038, sip: 75000 },
      ],
    },
  ];

  for (const c of clientConfigs) {
    const user = createdUserMap[c.email];
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        pan: c.pan,
        name: c.name,
        email: c.email,
        phone: c.phone,
        kycStatus: c.kycStatus,
        riskProfile: c.riskProfile,
        totalAum: c.totalAum,
        totalCost: c.totalCost,
        xirr: c.xirr,
        assignedAdvisor: c.assignedAdvisor,
      },
    });

    // Seed Holdings
    for (const h of c.holdings) {
      const fund = createdFunds[h.fundIdx];
      await prisma.holding.create({
        data: {
          clientId: client.id,
          fundId: fund.id,
          folioNumber: h.folio,
          units: h.units,
          avgNav: h.avgNav,
          currentNav: fund.nav,
          investedValue: h.invested,
          currentValue: h.current,
          absoluteReturn: Number((((h.current - h.invested) / h.invested) * 100).toFixed(2)),
          xirr: h.xirr,
        },
      });
    }

    // Seed SIPs
    for (const s of c.sips) {
      const fund = createdFunds[s.fundIdx];
      await prisma.sIP.create({
        data: {
          clientId: client.id,
          fundId: fund.id,
          folioNumber: s.folio,
          amount: s.amount,
          frequency: 'MONTHLY',
          sipDate: s.date,
          startDate: '10-Jan-2024',
          nextExecutionDate: `${String(s.date).padStart(2, '0')}-Nov-2026`,
          status: 'ACTIVE',
          mandateId: s.mandateId,
        },
      });
    }

    // Seed Transactions (Lumpsum orders, SIP installments, Redemptions, Switches)
    for (const t of c.transactions) {
      await prisma.transaction.create({
        data: {
          clientId: client.id,
          folioNumber: c.holdings[0]?.folio || 'GEN/001',
          schemeName: t.scheme,
          type: t.type,
          amount: t.amount,
          units: t.units,
          nav: t.nav,
          transDate: t.date,
          status: t.status,
          platform: 'BSE_STAR',
        },
      });
    }

    // Seed Goals
    for (const g of c.goals) {
      await prisma.goal.create({
        data: {
          clientId: client.id,
          title: g.title,
          category: g.category,
          targetAmount: g.target,
          currentAmount: g.current,
          targetYear: g.year,
          monthlySipRequired: g.sip,
          status: 'ON_TRACK',
        },
      });
    }

    // Seed Documents
    await prisma.document.create({
      data: {
        clientId: client.id,
        title: `Capital Gain Statement FY 2025-26 - ${c.name}`,
        docType: 'TAX',
        fileUrl: '/reports/capital-gains-fy26.pdf',
      },
    });
    await prisma.document.create({
      data: {
        clientId: client.id,
        title: `Consolidated Account Statement (CAS) - Sep 2026`,
        docType: 'CAS',
        fileUrl: '/reports/cas-sep-2026.pdf',
      },
    });

    // Seed Notifications
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Monthly SIP Processed',
        message: 'Your automated SIP of ₹25,000 for HDFC Top 100 Fund has been successfully processed via BSE StarMF.',
        type: 'SUCCESS',
      },
    });
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Portfolio Valuation Update',
        message: 'Quarterly valuation report is now ready for download in your Documents section.',
        type: 'INFO',
      },
    });
  }
  console.log('✓ 5 Clients seeded with Holdings, SIPs, Transactions, Goals, Documents & Notifications');

  // 4. Commercial Plans
  const plansData = [
    {
      name: 'Starter MFD',
      tagline: 'Ideal for independent financial advisors scaling their initial ₹5 Cr to ₹25 Cr AUM book.',
      monthlyPrice: 2499,
      yearlyPrice: 24990,
      isPopular: false,
      features: JSON.stringify([
        'Up to 300 Active Investors',
        'White-Label Web Portal with Custom Logo',
        'BSE StarMF & NSE NMF II Integration',
        'Automated CAS Import (CAMS & KFintech)',
        'Standard Capital Gain & Portfolio Reports',
        'Basic Email Campaigns & Birthday Wishes',
      ]),
    },
    {
      name: 'Professional Advisor',
      tagline: 'Engineered for high-velocity distributors and growing advisory teams managing ₹25 Cr to ₹150 Cr AUM.',
      monthlyPrice: 5999,
      yearlyPrice: 59990,
      isPopular: true,
      features: JSON.stringify([
        'Up to 1,500 Active Investors',
        'White-Label Web Portal + Branded Android & iOS Apps',
        'Direct 2-way BSE StarMF & NSE NMF Execution',
        'Robo Advisory & Model Portfolio Rebalancing Engine',
        'Digital Video KYC & Instant e-Sign Onboarding',
        'CRM Pipeline with Automated WhatsApp Bot Reminders',
        '40+ Advanced Visual Client Reports & Solvency Charts',
      ]),
    },
    {
      name: 'Enterprise Wealth Firm',
      tagline: 'Enterprise-grade infrastructure for national brokerages, wealth desks, and corporate ARN holders with >₹150 Cr AUM.',
      monthlyPrice: 14999,
      yearlyPrice: 149990,
      isPopular: false,
      features: JSON.stringify([
        'Unlimited Active Investors & Folios',
        'Custom Domain, Full White-Labeling & Custom App Splash',
        'Multi-Tier Hierarchy: Admin, Sub-Brokers, Branches, RMs',
        'Automated Trail Brokerage Reconciliation & Broker Invoicing',
        'Multi-Asset Integration: MF, PMS, AIF, Stocks, FDs, Bonds, NPS',
        'Custom API Webhooks & ERP Accounting Sync',
      ]),
    },
  ];

  for (const p of plansData) {
    await prisma.plan.create({ data: p });
  }
  console.log('✓ 3 Subscription Plans seeded');

  // 5. CRM Leads
  const leadsData = [
    {
      name: 'Sunil Narang',
      email: 'sunil@narangwealth.com',
      phone: '+91 98200 45678',
      arn: 'ARN-112340',
      city: 'Mumbai',
      interestedIn: 'White-label Mobile App, Robo Advisory, BSE StarMF Integration',
      stage: 'DEMO_SCHEDULED',
      score: 85,
      notes: 'Currently using legacy desktop software. Wants cloud migration for 400 clients before Diwali.',
      source: 'WEBSITE_CALLBACK',
    },
    {
      name: 'Deepak Chawla',
      email: 'deepak.chawla@finvestdelhi.in',
      phone: '+91 98101 23456',
      arn: 'ARN-89210',
      city: 'New Delhi',
      interestedIn: 'Multi-asset Tracking, Video KYC, CRM',
      stage: 'CONTACTED',
      score: 65,
      notes: 'AUM approx 65 Crores. Concerned about CAMS mailback automation.',
      source: 'DEMO_FORM',
    },
  ];

  for (const l of leadsData) {
    await prisma.lead.create({ data: l });
  }

  // 6. Testimonials
  await prisma.testimonial.create({
    data: {
      authorName: 'Ramesh Kulkarni',
      designation: 'Founder & Principal Consultant',
      companyName: 'Kulkarni Financial Services',
      location: 'Pune, Maharashtra',
      rating: 5,
      feedback: 'Switching to Portfolio Pro was the single best decision for my advisory practice. Our client SIP book grew by 42% in 9 months because clients genuinely enjoy checking their white-labeled app every week.',
      isApproved: true,
    },
  });

  // 7. Blog Posts
  await prisma.blogPost.create({
    data: {
      slug: 'how-mfd-can-scale-sip-book-to-1-crore-monthly',
      title: 'How Forward-Thinking MFDs are Scaling Their Monthly SIP Book Past ₹1 Crore',
      excerpt: 'Discover the operational playbooks, digital nudge automation, and client communication workflows used by top distributors across Tier-1 and Tier-2 cities.',
      category: 'Business Growth',
      author: 'Vikramaditya Singhania',
      readTime: '6 min read',
      isPublished: true,
      content: 'Digital-first MFDs are clocking ₹1 Crore+ in steady monthly SIP books through frictionless e-Mandates and automated rebalancing.',
    },
  });

  // 8. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: createdUserMap['admin@portfoliopro.in'].id,
      action: 'SYSTEM_INITIALIZATION',
      details: 'Platform initialized with 1 Admin, 2 Distributors, 5 Clients, and 7 Mutual Funds.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('----------------------------------------------------');
  console.log('✨ Portfolio Pro Seed Completed Successfully! ✨');
  console.log('Seed Summary:');
  console.log('  - 1 Super Admin: admin@portfoliopro.in');
  console.log('  - 2 Distributors:');
  console.log('      • Distributor 1 (ARN-189420): advisor@portfoliopro.in (3 clients)');
  console.log('      • Distributor 2 (ARN-234567): advisor2@portfoliopro.in (2 clients)');
  console.log('  - 5 Clients:');
  console.log('      • investor@portfoliopro.in (Rajesh Sharma, ₹48.5L AUM)');
  console.log('      • ananya.sen@client.in (Ananya Sen, ₹27.5L AUM)');
  console.log('      • rohan.gupta@client.in (Rohan Gupta, ₹8.5L AUM - KYC Pending)');
  console.log('      • meera.nair@client.in (Meera Nair, ₹39.0L AUM)');
  console.log('      • vikram.joshi@client.in (Vikram Joshi, ₹62.0L AUM)');
  console.log('  Password for all accounts: password123');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
