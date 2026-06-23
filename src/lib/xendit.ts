import Xendit from "xendit-node";

export const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
});

export const { Invoice } = xenditClient;

export async function createInvoice(params: {
  externalId: string;
  amount: number;
  payerEmail: string;
  description: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
}): Promise<{ invoiceId: string; checkoutUrl: string }> {
  const invoice = await Invoice.createInvoice({
    data: {
      externalId: params.externalId,
      amount: params.amount,
      payerEmail: params.payerEmail,
      description: params.description,
      currency: "PHP",
      invoiceDuration: 86400, // 24 hours
      successRedirectUrl: params.successRedirectUrl,
      failureRedirectUrl: params.failureRedirectUrl,
      paymentMethods: [
        "GCASH",
        "PAYMAYA",
        "BDO",
        "BPI",
        "CREDIT_CARD",
        "DEBIT_CARD",
      ],
    },
  });

  return {
    invoiceId: invoice.id!,
    checkoutUrl: invoice.invoiceUrl!,
  };
}
