import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AuthHelper from "../../helpers/AuthHelper";

export default function LoggedInRoute({protectedRoutes, children}){
    const router = useRouter()

    const isProtectedRoute = protectedRoutes.indexOf(router.pathname) !== -1

    useEffect(()=>{
        AuthHelper.isLoggedIn().then((res)=>{
            if(!res && isProtectedRoute)
            {
                router.push('/')
            }
        })        
    }, [isProtectedRoute])

    return children;
}