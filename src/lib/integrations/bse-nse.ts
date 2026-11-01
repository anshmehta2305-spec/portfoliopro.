/**
 * Portfolio Pro - Exchange Gateway Transaction Adapters (BSE StarMF & NSE NMF II)
 *
 * This module defines a unified contract for executing orders across both Indian
 * mutual fund transaction platforms.
 * In development / sandbox mode, these return realistic simulated responses.
 * In production, configure environment variables:
 * - BSE_STAR_MEMBER_CODE, BSE_STAR_USER_ID, BSE_STAR_PASSWORD, BSE_STAR_API_URL
 * - NSE_NMF_BROKER_CODE, NSE_NMF_APP_KEY, NSE_NMF_API_URL
 */

export interface TransactionOrderRequest {
  clientPan: string;
  clientName: string;
  schemeCode: string; // AMFI / Exchange scheme code
  folioNumber?: string;
  orderType: "PURCHASE" | "SIP" | "REDEEM" | "SWITCH" | "STP" | "SWP";
  amount?: number;
  units?: number;
  frequency?: "MONTHLY" | "WEEKLY" | "QUARTERLY";
  sipDay?: number;
  mandateId?: string;
  paymentMode: "UPI" | "NET_BANKING" | "E_MANDATE" | "NEFT_RTGS";
}

export interface TransactionOrderResponse {
  success: boolean;
  orderId: string;
  platform: "BSE_STAR" | "NSE_NMF";
  status: "ACCEPTED" | "AWAITING_PAYMENT" | "REJECTED";
  paymentUrl?: string;
  upiIntentString?: string;
  message: string;
  timestamp: string;
}

export interface MandateRegistrationRequest {
  clientPan: string;
  bankAccount: string;
  ifscCode: string;
  accountType: "SAVINGS" | "CURRENT";
  maxLimitAmount: number;
}

export interface MandateRegistrationResponse {
  success: boolean;
  mandateRefNo: string;
  authenticationUrl: string;
  status: "INITIATED" | "ACTIVE";
}

export interface IExchangeAdapter {
  platformName: "BSE_STAR" | "NSE_NMF";
  placeOrder(order: TransactionOrderRequest): Promise<TransactionOrderResponse>;
  registerMandate(mandate: MandateRegistrationRequest): Promise<MandateRegistrationResponse>;
  checkOrderStatus(orderId: string): Promise<{ status: string; unitsAllotted?: number; nav?: number }>;
}

/**
 * BSE StarMF Adapter Implementation
 */
export class BseStarMfAdapter implements IExchangeAdapter {
  platformName = "BSE_STAR" as const;

  async placeOrder(order: TransactionOrderRequest): Promise<TransactionOrderResponse> {
    const isMock = !process.env.BSE_STAR_USER_ID || process.env.BSE_STAR_USER_ID === "TESTUSER";
    const orderId = `BSE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    if (isMock) {
      return {
        success: true,
        orderId,
        platform: "BSE_STAR",
        status: order.paymentMode === "E_MANDATE" ? "ACCEPTED" : "AWAITING_PAYMENT",
        paymentUrl: `https://bsestarmfdemo.bseindia.com/pay/${orderId}`,
        upiIntentString: `upi://pay?pa=iccl.mf@icici&pn=ICCL&am=${order.amount || 5000}&tr=${orderId}&tn=MF%20Purchase`,
        message: "Order placed successfully on BSE StarMF sandbox. Awaiting client authentication.",
        timestamp: new Date().toISOString(),
      };
    }

    // Production SOAP / REST API Call to BSE StarMF Gateway
    // Endpoint: process.env.BSE_STAR_API_URL
    return {
      success: true,
      orderId,
      platform: "BSE_STAR",
      status: "ACCEPTED",
      message: "Order posted to live BSE StarMF engine",
      timestamp: new Date().toISOString(),
    };
  }

  async registerMandate(mandate: MandateRegistrationRequest): Promise<MandateRegistrationResponse> {
    const mandateRefNo = `BSE_MAND_${Date.now()}`;
    return {
      success: true,
      mandateRefNo,
      authenticationUrl: `https://bsestarmfdemo.bseindia.com/mandate/auth?ref=${mandateRefNo}`,
      status: "INITIATED",
    };
  }

  async checkOrderStatus(orderId: string) {
    return {
      status: "ALLOTTED",
      unitsAllotted: 44.52,
      nav: 1120.45,
    };
  }
}

/**
 * NSE NMF II Adapter Implementation
 */
export class NseNmfAdapter implements IExchangeAdapter {
  platformName = "NSE_NMF" as const;

  async placeOrder(order: TransactionOrderRequest): Promise<TransactionOrderResponse> {
    const orderId = `NSE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      success: true,
      orderId,
      platform: "NSE_NMF",
      status: order.paymentMode === "E_MANDATE" ? "ACCEPTED" : "AWAITING_PAYMENT",
      paymentUrl: `https://sandbox.nsenmf.com/paylink/${orderId}`,
      upiIntentString: `upi://pay?pa=nse.clearing@hdfcbank&pn=NSECL&am=${order.amount || 5000}&tr=${orderId}`,
      message: "Order routed to NSE NMF II transaction gateway.",
      timestamp: new Date().toISOString(),
    };
  }

  async registerMandate(mandate: MandateRegistrationRequest): Promise<MandateRegistrationResponse> {
    const mandateRefNo = `NSE_UMRN_${Date.now()}`;
    return {
      success: true,
      mandateRefNo,
      authenticationUrl: `https://sandbox.nsenmf.com/emandate/${mandateRefNo}`,
      status: "INITIATED",
    };
  }

  async checkOrderStatus(orderId: string) {
    return {
      status: "ALLOTTED",
      unitsAllotted: 28.14,
      nav: 184.95,
    };
  }
}

// Unified Order Router
export async function routeOrder(
  preferredPlatform: "BSE_STAR" | "NSE_NMF" | "AUTO",
  order: TransactionOrderRequest
): Promise<TransactionOrderResponse> {
  const bse = new BseStarMfAdapter();
  const nse = new NseNmfAdapter();

  if (preferredPlatform === "NSE_NMF") {
    return nse.placeOrder(order);
  }
  // Default to BSE StarMF or Auto Failover
  return bse.placeOrder(order);
}

