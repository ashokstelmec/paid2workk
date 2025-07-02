import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useChat } from "../../contexts/chatContext";
import { useAuth } from "../../contexts/authContext";

const jobType = [
  { label: "Hourly Rate", value: "0" },
  { label: "Fixed Price", value: "1" },
];

// const currencies = [
//   { value: "2", label: "INR (₹)" },
//   { value: "1", label: "USD ($)" },
//   { value: "3", label: "EUR (€)" },
//   { value: "4", label: "GBP (£)" },
// ];

const getCurrencySymbol = (currencyCode) => {
  switch (currencyCode) {
    case "1":
      return "USD ($)";
    case "3":
      return "EUR (€)";
    case "4":
      return "GBP (£)";
    case "2":
      return "INR (₹)";
    default:
      return "INR (₹)";
  }
};

export function CreateQuotationModal({ isOpen, onClose }) {
  const { sendQuotation, activeContact } = useChat();
  const { getCurrencySymbolId, getCurrencySymbolName } = useAuth();
  const [title, setTitle] = useState(activeContact?.projectName || "");
  const [items, setItems] = useState([
    { description: "", price: "", time: "" },
  ]);
  const [type, setType] = useState("0");
  const [currency, setCurrency] = useState("2");
  const [errors, setErrors] = useState({});
  const [currencies, setCurrencies] = useState([]);

  const addItem = () => {
    setItems([...items, { description: "", price: "", time: "" }]);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + (parseFloat(item.price) || 0), 0)
      .toFixed(2);
  };

  const calculateTotalTime = () => {
    return items
      .reduce((total, item) => total + (parseFloat(item.time) || 0), 0)
      .toFixed(2);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Quotation title is required.";

    items.forEach((item, index) => {
      if (!item.description.trim())
        newErrors[`description-${index}`] =
          "Milestone description is required.";
      if (!item.time.trim()) newErrors[`time-${index}`] = "Time is required.";
      if (!/^\d+(\.\d{0,2})?$/.test(item.time.trim()))
        newErrors[`time-${index}`] = "Invalid time format.";

      if (!item.price.trim())
        newErrors[`price-${index}`] = "Price is required.";
      if (!/^\d+(\.\d{0,2})?$/.test(item.price.trim()))
        newErrors[`price-${index}`] = "Invalid price format.";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const quotationData = {
      title,
      type,
      currency,
      items: items.filter(
        (item) => item.description && item.price && item.time
      ),
      total: `${calculateTotalTime()} ${calculateTotal()}`,
    };

    sendQuotation(quotationData);
    onClose();
  };

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          "https://paid2workk.solarvision-cairo.com/api/Projects_/GetActiveCurrency"
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setCurrencies(
            data.map((curr) => ({
              value: curr.currency_Id,
              label: curr.currency_Name,
              short: curr.currency,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching currencies:", error);
        // Fallback to default currencies if API fails
      }
    };

    fetchCurrencies();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90dvh] w-[95vw] max-w-md sm:max-w-xl overflow-y-scroll">
        <DialogHeader>
          <DialogTitle className="p-4">Create Quotation</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 px-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quotation Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-red text-xs">{errors.title}</p>}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white" id="jobType">
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  {jobType.map((job) => (
                    <SelectItem key={job.value} value={job.value}>
                      {job.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-white" id="currency">
                  <SelectValue placeholder="Select Currency">
                    {currencies.find((curr) => curr.value === currency)
                      ?.label || "Select Currency"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col w-full sm:w-3/5">
                <Input
                  placeholder={`Milestone ${index + 1}`}
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  className=""
                />
                {errors[`description-${index}`] && (
                  <p className="text-red text-xs">
                    {errors[`description-${index}`]}
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full sm:w-2/5">
                <div className="flex flex-col w-full">
                  <Input
                    placeholder={type === "0" ? "Hours" : "Days"}
                    value={item.time}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "time",
                        e.target.value.replace(/[^0-9.]/g, "")
                      )
                    }
                    className="w-full"
                  />
                  {errors[`time-${index}`] && (
                    <p className="text-red text-xs">
                      {errors[`time-${index}`]}
                    </p>
                  )}
                </div>

                <div className="flex flex-col w-full">
                  <Input
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "price",
                        e.target.value.replace(/[^0-9.]/g, "")
                      )
                    }
                    className="w-full"
                  />
                  {errors[`price-${index}`] && (
                    <p className="text-red text-xs">
                      {errors[`price-${index}`]}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="h-4 w-4 text-red" />
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>

        <DialogFooter className="flex flex-col gap-2 sticky bottom-0 bg-background p-4 border-t">
          <div className="flex  font-medium mb-3 gap-3">
            <span className="w-1/3 sm:w-3/5">Total:</span>
            <div className="flex items-center gap-4 md:gap-2 w-2/3 sm:w-2/5 justify-center md:justify-start pl-1.5">
              <div className="flex flex-col w-full ">
                <span>{calculateTotalTime()}</span>
                <span className="text-xs font-normal text-black/60">
                  {type === "0" ? "(Hours)" : "(Days)"}
                </span>
              </div>
              <div className="flex flex-col w-full sm:w-20">
                <span className="text-nowrap overflow-x-visible">
                  {getCurrencySymbolId(currency)} {calculateTotal()}
                </span>
                <span className="text-xs font-normal text-black/60 ">
                  ({getCurrencySymbolName(currency)})
                </span>
              </div>
              <div className="w-4 h-4 flex-shrink-0 hidden sm:block"></div>
            </div>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="w-full sm:w-auto">
              Send Quotation
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
