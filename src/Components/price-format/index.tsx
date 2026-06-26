function PriceFormat({ price }: { price: number }) {
  const formattedPrice = price.toLocaleString("en", {
    style: "currency",
    currency: "SYP",
    currencyDisplay: "name",
  });

  return <>{formattedPrice}</>;
}

export default PriceFormat;
