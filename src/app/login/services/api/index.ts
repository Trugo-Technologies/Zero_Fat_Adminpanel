import { api } from "src/redux-config/store";
import { endPoints } from "src/shared/end-points";

const authService = api.injectEndpoints({
  endpoints: (build) => {
    return {
      login: build.mutation<any, any>({
        query: (body) => ({
          data: body,
          url: endPoints.loginEndPoint().pathname,
          method: "POST",
          headers: {
            BaseDeviceId: "3c212d88-cd4a-4593-a4b0-65859fb175a5",
            DeviceModel: "Windows 10",
            DeviceType: "Web",
            Platform: "ERP CMS",
            Version: "V 1.0",
          },
        }),
      }),
    };
  },
});

export const { useLoginMutation } = authService;
