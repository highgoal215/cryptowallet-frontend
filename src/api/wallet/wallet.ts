import axios, { AxiosError } from "axios";

const Backend_Url = 'http://localhost:5000/api';

export const CreateNewWallet = async (addressType: string, accountName: string) => {
    try {

        const response = await axios.post(`${Backend_Url}/walletcreate`, {
            addressType,
            accountName
        }, {
            withCredentials: true
        });

        const walletData = response.data;

        return walletData;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("Axios error creating wallet:", axiosError.response?.data || axiosError.message);
        } else {
            console.error("Unexpected error:", error);
        }

        return null;
    }
}

export const ImportWallet = async (privateKey: string, accountName: string, addressType: string) => {
    try {
        const response = await axios.post(`${Backend_Url}/importwallet`, { privateKey, accountName, addressType }, {
            withCredentials: true
        });

        const importWallet = response.data

        return importWallet;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("Axios error importing wallet:", axiosError.response?.data || axiosError.message);
        } else {
            console.error("Unexpected error:", error);
        }

        return null;
    }
}

export const Transfer = async (fromAddress: string, toAddress: string, amount: string, walletType : string) => {
    try {
        const response = await axios.post(`${Backend_Url}/transfer/${walletType}`, { fromAddress, toAddress, amount }, {
            withCredentials: true
        });

        const result = response.data;
        return result;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("Axios error transfering wallet: ", axiosError.response?.data || axiosError.message);
        } else console.error("Unexpected error: ", error);
    }
}

export const GetAllWallets = async () => {
    try {
        const response = await axios.get(`${Backend_Url}/wallets`, {
            withCredentials: true
        });
        return response.data;
    } catch (error: any) {
        console.error("Get All Wallet Error:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            url: `${Backend_Url}/wallets`,
        });
        throw new Error("Failed to fetch wallets");
    }
};