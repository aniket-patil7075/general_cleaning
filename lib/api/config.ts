export interface ApiEndpoint {
    url: string
    method: "GET" | "POST" | "PUT" | "DELETE"
  }
  
  export const API_ENDPOINTS: Record<string, ApiEndpoint> = {
    getZoneId: {
      url: "https://test.barakatbayut.com/api/v1/customer/config/get-zone-id",
      method: "GET",
    },
    getCategories: {
      url: "https://test.barakatbayut.com/api/v1/customer/categories",
      method: "GET",
    },
    getServices: {
      url: "https://test.barakatbayut.com/api/v1/customer/services",
      method: "GET",
    },
    getCustomerAddress: {
      url: "https://test.barakatbayut.com/api/v1/customer/address",
      method: "GET",
    },
    saveCartData: {
      url: "https://test.barakatbayut.com/api/v1/customer/cart/add",
      method : "POST",
    },
    getCartData : {
      url : "https://test.barakatbayut.com/api/v1/customer/cart/list?limit=100&offset=1&&guest_id=f124d7e0-f815-11ef-b1a6-ad24eae42883",
      method: "GET"
    },
    getServiceData : {
      url: "https://test.barakatbayut.com/api/v1/customer/service?offset=1&limit=10",
      method : "GET"
    }
    // Add other API endpoints here as needed
  }
  
  