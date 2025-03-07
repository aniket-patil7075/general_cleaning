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

  // Call useApi for each endpoint at the top level
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
