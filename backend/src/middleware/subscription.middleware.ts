import paymentRepository from "../repository/payment.repository";
import businessRepository from "../repository/business.repository";

export const validateBusinessSubscription = async (
  businessId: string,
) => {
  const latestPayment = await paymentRepository
    .getLatestPaymentByBusiness(businessId);

  if (!latestPayment) {
    return false;
  }
  
  const now = new Date();
  const expired = new Date(latestPayment.endAt) < now;

  if (expired) {
    await businessRepository.update(businessId, {
      status: false,
    });

    return false;
  }

  return true;
};