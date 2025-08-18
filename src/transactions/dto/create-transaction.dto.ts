export class CreateTransactionDto {
  buyer_id: string;
  seller_id: string;
  amount: number;
  product: string;
  status: string;
  escrow_id?: string;
}