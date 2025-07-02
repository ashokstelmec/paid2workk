import React from "react";
import { Modal } from "@mui/material";
import { ChevronDown, Clock } from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import { Button } from "../../components/ui/button";

export default function BidModal({
  open,
  handleClose,
  bidAmount,
  setBidAmount,
  currencyId,
  setCurrencyId,
  deliveryTime,
  setDeliveryTime,
  proposal,
  setProposal,
  handleBidSubmission,
}) {
  const { currencies, getCurrencySymbolId } = useAuth();

  const handleChangeBidAmount = (value) => {
    if (/^\d*$/.test(value)) {
      setBidAmount(value);
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="bid-modal-title"
      aria-describedby="bid-modal-description"
      className="px-2"
    >
      <div className="flex justify-center items-center min-h-screen  p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="text-primary p-4 border-b">
            <h2 className="text-lg font-semibold tracking-tight">
              Submit Your Bid
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Complete the form below to place your bid
            </p>
          </div>

          <form onSubmit={handleBidSubmission} className="p-4 space-y-3">
            <div className="space-y-2">
              <label
                htmlFor="bidAmount"
                className="block text-sm font-medium text-slate-700"
              >
                Bid Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <h3>{getCurrencySymbolId(currencyId)}</h3>
                </div>
                <input
                  type="text"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => handleChangeBidAmount(e.target.value)}
                  className="pl-10 block w-full h-10  focus:outline-none rounded-md border shadow-sm sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-slate-700"
              >
                Currency
              </label>
              <div className="relative">
                <select
                  id="currency"
                  value={currencyId}
                  onChange={(e) => setCurrencyId(e.target.value)}
                  className="block w-full h-10 rounded-md border focus:outline-none shadow-sm sm:text-sm appearance-none pr-10 pl-3"
                >
                  {currencies.map((c) => {
                    return (
                      <option key={c.currency_Id} value={c.currency_Id}>
                        {`${c.currency} (${c.symbol})`}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="deliveryTime"
                className="block text-sm font-medium text-slate-700"
              >
                Delivery Time (in days)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="number"
                  id="deliveryTime"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="pl-10 block w-full h-10 rounded-md border  focus:outline-none shadow-sm  sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="proposal"
                className="block text-sm font-medium text-slate-700"
              >
                Proposal
              </label>
              <div className="relative">
                <textarea
                  id="proposal"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  rows={4}
                  placeholder="Describe your proposal in detail (at least 30 characters)"
                  className="pl-3 pt-3 block w-full rounded-md border focus:outline-none shadow-sm  sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                className="border-red text-red"
                variant="outline"
                type="button"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={proposal.length < 30}>
                Submit Bid
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
