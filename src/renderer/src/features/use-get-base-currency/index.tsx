import { useMemo } from "react";
import {
  Currency,
  useGetAllCurrencyQuery,
} from "../../providers/store/api/currencyApi";

export const useGetBaseCurrency = () => {
  const { data: currencies } = useGetAllCurrencyQuery();

  const baseCurrency: Currency | undefined = useMemo(() => {
    return currencies?.data.find((currency) => currency.default === true);
  }, [currencies]);

  return baseCurrency;
};
