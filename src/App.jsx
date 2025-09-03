import React, { useState, useEffect } from "react";
import LineItem from "./LineItem.jsx";
import { formatCurrency, inputClasses } from "./utils/index.js";

const App = () => {
  const [lineItems, setLineItems] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [taxRate, setTaxRate] = useState(8);
  const [discountRate, setDiscountRate] = useState(0);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedLineItems = localStorage.getItem("invoiceLineItems");
    const savedNextId = localStorage.getItem("invoiceNextId");
    const savedTaxRate = localStorage.getItem("invoiceTaxRate");
    const savedDiscountRate = localStorage.getItem("invoiceDiscountRate");

    if (savedLineItems) {
      try {
        const parsedItems = JSON.parse(savedLineItems);
        setLineItems(parsedItems);
      } catch (error) {
        console.error("Error parsing saved line items:", error);
      }
    }

    if (savedNextId) {
      setNextId(parseInt(savedNextId, 10));
    }

    if (savedTaxRate) {
      setTaxRate(parseFloat(savedTaxRate));
    }

    if (savedDiscountRate) {
      setDiscountRate(parseFloat(savedDiscountRate));
    }
  }, []);

  // Helper function to save to localStorage
  const saveToLocalStorage = (
    items,
    nextIdValue,
    tax = taxRate,
    discount = discountRate
  ) => {
    localStorage.setItem("invoiceLineItems", JSON.stringify(items));
    localStorage.setItem("invoiceNextId", nextIdValue.toString());
    localStorage.setItem("invoiceTaxRate", tax.toString());
    localStorage.setItem("invoiceDiscountRate", discount.toString());
  };

  // Calculate totals
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const discountAmount = subtotal * (discountRate / 100);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = subtotalAfterDiscount * (taxRate / 100);
  const total = subtotalAfterDiscount + tax;

  // Add new line item
  const addLineItem = () => {
    const newItem = {
      id: nextId,
      service: "",
      unitPrice: 0,
      quantity: 1,
    };
    const updatedItems = [...lineItems, newItem];
    const updatedNextId = nextId + 1;

    setLineItems(updatedItems);
    setNextId(updatedNextId);
    saveToLocalStorage(updatedItems, updatedNextId);
  };

  // Update line item
  const updateLineItem = (id, field, value) => {
    const updatedItems = lineItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setLineItems(updatedItems);
    saveToLocalStorage(updatedItems, nextId);
  };

  const removeLineItem = (id) => {
    const updatedItems = lineItems.filter((item) => item.id !== id);
    setLineItems(updatedItems);
    saveToLocalStorage(updatedItems, nextId);
  };

  // Update tax rate
  const handleTaxRateChange = (e) => {
    const newTaxRate = Math.max(0, parseFloat(e.target.value) || 0);
    setTaxRate(newTaxRate);
    saveToLocalStorage(lineItems, nextId, newTaxRate, discountRate);
  };

  // Update discount rate
  const handleDiscountRateChange = (e) => {
    const newDiscountRate = Math.max(0, parseFloat(e.target.value) || 0);
    setDiscountRate(newDiscountRate);
    saveToLocalStorage(lineItems, nextId, taxRate, newDiscountRate);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-2/3 max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Invoice Builder
        </h1>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {/* Line Items Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Line Items
              </h2>
              <button
                onClick={addLineItem}
                className="bg-gray-600  text-white px-4 py-2 rounded-md font-medium transition-colors active:opacity-50"
              >
                Add Item
              </button>
            </div>

            {lineItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No items added yet. Click "Add Item" to get started.
              </p>
            ) : (
              <div className="space-y-4 w-full max-h-[60vh] overflow-y-auto">
                {lineItems.map((item) => (
                  <LineItem
                    key={item.id}
                    item={item}
                    onUpdate={(field, value) =>
                      updateLineItem(item.id, field, value)
                    }
                    onRemove={() => removeLineItem(item.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Totals Section */}
          {lineItems.length > 0 && (
            <div className="border-t pt-6">
              <div className="max-w-md ml-auto space-y-3">
                {/* Tax and Discount Rate Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={taxRate}
                      onChange={handleTaxRateChange}
                      min="0"
                      step="0.1"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={discountRate}
                      onChange={handleDiscountRateChange}
                      min="0"
                      step="0.1"
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Calculations */}
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-lg text-green-600">
                    <span>Discount ({discountRate}%):</span>
                    <span className="font-medium">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                {discountRate > 0 && (
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">After Discount:</span>
                    <span className="font-medium">
                      {formatCurrency(subtotalAfterDiscount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Tax ({taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
