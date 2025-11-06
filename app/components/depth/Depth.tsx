"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { BidTable } from "./BidTable";
import { AskTable } from "./AskTable";
import { SignalingManager } from "@/app/utils/SignalingManager";
// import { Depth } from "@/app/utils/types";

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        getDepth(market).then(d => {
            setBids(d.bids.reverse());
            setAsks(d.asks);
        });

        getTicker(market).then(t => setPrice(t.lastPrice));
        SignalingManager.getInstance().registerCallback("depth", (data : any)=> {
            setBids((originalBids = []) => {
            // Step 1: Copy old bids to mutate safely
            let updatedBids = [...originalBids];

            // Step 2: For each incoming bid [price, qty]
            for (const [price, qty] of data.bids) {
                const quantity = Number(qty);
                const existingIndex = updatedBids.findIndex(b => b[0] === price);

                if (existingIndex !== -1) {
                // Case 1: Price already exists → update or remove
                    if (quantity === 0) {
                        updatedBids.splice(existingIndex, 1); // remove it
                    } else {
                        updatedBids[existingIndex][1] = qty; // update its quantity
                    }
                } else {
                // Case 2: Price does NOT exist → add it (if qty > 0)
                    if (quantity > 0) {
                        updatedBids.push([price, qty]);
                    }
                }
            }

            // Step 3 (optional): sort bids descending by price, if you want a proper order book
            updatedBids.sort((a, b) => Number(b[0]) - Number(a[0]));

            return updatedBids;
            });

        
             setAsks((originalAsks = []) => {
                // Step 1: Copy old bids to mutate safely
                let updatedAsks = [...originalAsks];

                // Step 2: For each incoming bid [price, qty]
                for (const [price, qty] of data.asks) {
                    const quantity = Number(qty);
                    const existingIndex = updatedAsks.findIndex(b => b[0] === price);

                    if (existingIndex !== -1) {
                    // Case 1: Price already exists → update or remove
                    if (quantity === 0) {
                        updatedAsks.splice(existingIndex, 1); // remove it
                    } else {
                        updatedAsks[existingIndex][1] = qty; // update its quantity
                    }
                    } else {
                    // Case 2: Price does NOT exist → add it (if qty > 0)
                    if (quantity > 0) {
                        updatedAsks.push([price, qty]);
                    }
                    }
                }

                // Step 3 (optional): sort bids asending by price, if you want a proper order book
                updatedAsks.sort((a, b) => Number(a[0]) - Number(b[0]));

                return updatedAsks;
            });
        }, `DEPTH-${market}`)
            SignalingManager.getInstance().sendMessage({"method": "SUBSCRIBE", "params": [`depth.200ms.${market}`]})
    
            return ()=> {
                SignalingManager.getInstance().sendMessage({"method": "UNSUBSCRIBE", "params": [`depth.200ms.${market}`]})
                SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            }
    }, [market])
    
    return <div>
        <TableHeader />
        {asks && <AskTable asks={asks} />}
        {price && <div>{price}</div>}
        {bids && <BidTable bids={bids} />}
    </div>
}

function TableHeader() {
    return <div className="flex justify-between text-xs">
    <div className="text-white">Price</div>
    <div className="text-slate-500">Size</div>
    <div className="text-slate-500">Total</div>
</div>
}