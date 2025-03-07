"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useApi } from "./useApi";
import { API_ENDPOINTS } from "./config";

interface Service {
  id: string;
  name: string;
  thumbnail: string;
  short_description: string;
}

type ApiHooksType = {
  [K in keyof typeof API_ENDPOINTS]: ReturnType<typeof useApi>;
};

type ApiContextType = ApiHooksType & {
  needMaterials: boolean;
  setNeedMaterials: (value: boolean) => void;
  addressData: any;
  fetchAddressData: () => Promise<void>;
  selectedDates: Date[];
  setSelectedDates: (dates: Date[]) => void;
  grandTotal: any;
  setGrandTotal: (value: any) => void;
  bookingId: string | null;
  setBookingId: (id: string | null) => void;
  apiGrandTotal: string | null;
  setApiGrandTotal: (value: string | null) => void;
  apiHoursData: string | null;
  setApiHoursData: (value: string | null) => void;
  apiProfessionalData: string | null;
  setApiProfessionalData: (value: string | null) => void;
  selectedDate: number | null;
  setSelectedDate: (value: number | null) => void;
  selectedTime: string | null;
  setSelectedTime: (value: string | null) => void;
  flag: string;
  setFlag: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  attributeId: string;
  setAttributeId: (value: string) => void;
  transactionReference: string;
  setTransactionReference: (value: string) => void;
  instructions: string;
  setInstructions: (value: string) => void;
  trendingServices: any;
  setTrendingServices: (value: any) => void;
  hourData: number | null;
  setHourData: (value: number | null) => void;
  professionalData: number | null;
  setProfessionalData: (value: number | null) => void;
  totalTax: number | null;
  setTotalTax: (value: number | null) => void;
  cartData: any;
  setCartData: (value: any) => void;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const apiHooks: ApiContextType = {} as ApiContextType;
  const [needMaterials, setNeedMaterials] = useState(false);
  const getCustomerAddress = useApi("getCustomerAddress");
  const [addressData, setAddressData] = useState<any>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [grandTotal, setGrandTotal] = useState<any>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [apiGrandTotal, setApiGrandTotal] = useState<string | null>(null);
  const [apiHoursData, setApiHoursData] = useState<string | null>(null);
  const [apiProfessionalData, setApiProfessionalData] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [flag, setFlag] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [attributeId, setAttributeId] = useState<string>("");
  const [transactionReference, setTransactionReference] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [trendingServices, setTrendingServices] = useState<any>(null);
  const [hourData, setHourData] = useState<number | null>(null);
  const [professionalData, setProfessionalData] = useState<number | null>(null);
  const [totalTax, setTotalTax] = useState<number | null>(null);
  const [cartData, setCartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const zoneId = "a1614dbe-4732-11ee-9702-dee6e8d77be4";


  const fetchAddressData = async () => {
    try {
      const response = await getCustomerAddress.execute({
        limit: 100,
        offset: 1,
        guest_id: "f124d7e0-f815-11ef-b1a6-ad24eae42883",
      });
      if (response?.content?.data) {
        setAddressData(response.content.data);
      } else {
        console.warn("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAddressData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!zoneId) {
        setError("No zone ID provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [servicesResponse] = await Promise.all([
          fetch(
            `https://test.barakatbayut.com/api/v1/customer/service?offset=1&limit=10`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                zoneid: zoneId,
                "x-localization": "en",
              },
            }
          ),
        ]);

        if (!servicesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const servicesData = await servicesResponse.json();

        if (servicesData.content && Array.isArray(servicesData.content.data)) {
          setTrendingServices(servicesData.content.data);
        } else {
          console.error(
            "Unexpected services API response structure:",
            servicesData
          );
          setTrendingServices([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [zoneId]);

  const fetchCartData = async () => {


    try {
      const response = await fetch(
        "https://test.barakatbayut.com/api/v1/customer/cart/list?limit=100&offset=1&&guest_id=f124d7e0-f815-11ef-b1a6-ad24eae42883"
      );
      const result = await response.json();
      console.log("Cart Data:", result);

      if (result?.content?.cart?.data) {
        const cartItems = result.content.cart.data;

        const hourItem = cartItems.find(
          (item) => item.variant_key === "Number-of-Hours"
        );
        const professionalItem = cartItems.find(
          (item) => item.variant_key === "Professionals"
        );

        setHourData(hourItem ? hourItem.quantity : 0);
        setProfessionalData(professionalItem ? professionalItem.quantity : 0);

        setGrandTotal(hourItem?.total_cost || 0);
        setTotalTax((hourItem?.tax_amount || 0) + (professionalItem?.tax_amount || 0));
        
        setCartData(cartItems);
      } else {
        console.warn("No data found in response");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  for (const key in API_ENDPOINTS) {
    if (API_ENDPOINTS.hasOwnProperty(key)) {
      apiHooks[key as keyof typeof API_ENDPOINTS] = useApi(
        key as keyof typeof API_ENDPOINTS
      );
    }
  }

  return (
    <ApiContext.Provider
      value={{
        ...apiHooks,
        needMaterials,
        setNeedMaterials,
        addressData,
        selectedDates,
        setSelectedDates,
        grandTotal,
        setGrandTotal,
        bookingId,
        setBookingId,
        apiGrandTotal,
        setApiGrandTotal,
        apiHoursData,
        setApiHoursData,
        apiProfessionalData,
        setApiProfessionalData,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        flag,
        setFlag,
        paymentMethod,
        setPaymentMethod,
        attributeId,
        setAttributeId,
        transactionReference,
        setTransactionReference,
        instructions,
        setInstructions,
        trendingServices,
        setTrendingServices,
        hourData, setHourData , professionalData, setProfessionalData , totalTax, setTotalTax , cartData, setCartData ,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
}
