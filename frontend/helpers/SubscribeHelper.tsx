import Axios from 'axios';
import EndpointHelper from '../helpers/EndpointHelper';
import { BaseResponse } from '../utilities/Responses';

export default class SubscribeHelper{
    static getSubscribe(){
        throw new Error('Method not implemented.');
    }

    public static addSubscription = async (PodcastId): Promise<BaseResponse> => {
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.addSubscriptionEndpoint(PodcastId),
            withCredentials: true, 
            cache: false,
        };

        try {
            const response = await Axios(options);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }

    };

    public static addUnsubscription = async (PodcastId): Promise<BaseResponse> => {
        const options = {
            method: "POST",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.addUnsubscriptionEndpoint(PodcastId),
            withCredentials: true, 
            cache: false,
        };

        try {
            const response = await Axios(options);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }

    };

    public static getIsSubscribed = async (PodcastId): Promise<BaseResponse> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getIsSubscribedEndpoint(PodcastId),
            withCredentials: true, 
            cache: false,
        };

        try {
            const response = await Axios(options);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }

    };

    public static getMySubscriptions = async (): Promise<BaseResponse> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getMySubscriptionsEndpoint(),
            withCredentials: true, 
            cache: false,
        };

        try {
            const response = await Axios(options);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }

    };

    public static getAllPodcastSubscriptions = async (PodcastId): Promise<BaseResponse> => {
        const options = {
            method: "GET",
            headers: {
                accept: "*/*",
                "Content-Type": "application/json",
            },
            url: EndpointHelper.getAllPodcastSubscriptionsEndpoint(PodcastId),
            withCredentials: true, 
            cache: false,
        };

        try {
            const response = await Axios(options);
            return response.data;
        } catch (error) {
            console.log(error);
            return error.response.data;
        }

    };































}