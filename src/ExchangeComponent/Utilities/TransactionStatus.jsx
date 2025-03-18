import React, { useEffect, useState } from "react";
import { useExecutionStatus } from "@reservoir0x/relay-kit-hooks";

const TransactionStatus = ({ txHash, chainId = 534351 }) => {
   const [status, setStatus] = useState("pending");
   const [explorerUrl, setExplorerUrl] = useState("");

   // Replace useTransaction with useExecutionStatus
   const { data: txData, isLoading } = useExecutionStatus({
      hash: txHash,
      chainId,
      enabled: Boolean(txHash),
   });

   useEffect(() => {
      if (txHash) {
         setExplorerUrl(`https://sepolia.scrollscan.dev/tx/${txHash}`);
      }

      if (txData) {
         // Assuming txData.status works the same way
         if (txData.status === 1) {
            setStatus("success");
         } else if (txData.status === 0) {
            setStatus("failed");
         }
      }
   }, [txHash, txData]);

   if (!txHash) return null;

   return (
      <div
         className={`alert alert-${
            status === "pending"
               ? "warning"
               : status === "success"
               ? "success"
               : "danger"
         }`}>
         <div className="d-flex justify-content-between align-items-center">
            <div>
               <strong>
                  Transaction{" "}
                  {status === "pending"
                     ? "Pending"
                     : status === "success"
                     ? "Successful"
                     : "Failed"}
               </strong>
               {isLoading && <span className="ms-2">Checking status...</span>}
            </div>
            <a
               href={explorerUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="btn btn-sm btn-outline-secondary">
               View on Explorer
            </a>
         </div>
         <div className="mt-2">
            <small>Transaction Hash: {txHash}</small>
         </div>
      </div>
   );
};

export default TransactionStatus;
