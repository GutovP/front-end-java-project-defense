export interface Basket {
  items: BasketItems[];
  totalPrice: number;
}

export interface BasketItems {
  basketId: string;
  productName: string;
  image: string;
  productPrice: number;
  quantity: number;
  itemTotalPrice: number;
}
