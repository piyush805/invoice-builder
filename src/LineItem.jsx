import React from "react";
import { formatCurrency, inputClasses } from "./utils/index.js";

const LineItem = ({ item, onUpdate, onRemove }) => {
  const lineTotal = item.unitPrice * item.quantity;

  // Handle input validation
  const handleQuantityChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const validatedValue = Math.max(0, value); // Ensure quantity >= 0
    onUpdate("quantity", validatedValue);
  };

  const handleUnitPriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    const validatedValue = Math.max(0, value); // Ensure unit price >= 0
    onUpdate("unitPrice", validatedValue);
  };

  const handleServiceChange = (e) => {
    onUpdate("service", e.target.value);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-12 gap-3 items-center p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        {/* Service Name Input */}
        <div className="col-span-5">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Service
          </label>
          <input
            type="text"
            value={item.service || ""}
            onChange={handleServiceChange}
            placeholder="Enter service name"
            className={inputClasses}
          />
        </div>

        {/* Unit Price */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Unit Price
          </label>
          <input
            type="number"
            value={item.unitPrice || ""}
            onChange={handleUnitPriceChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClasses}
          />
        </div>

        {/* Quantity */}
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            value={item.quantity || ""}
            onChange={handleQuantityChange}
            placeholder="1"
            min="0"
            step="1"
            className={inputClasses}
          />
        </div>

        {/* Line Total (Read-only) */}
        <div className="col-span-2 text-right">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Line Total
          </label>
          <div className="py-2">
            <span className="font-semibold text-gray-900 text-sm">
              {formatCurrency(lineTotal)}
            </span>
          </div>
        </div>

        {/* Remove Button */}
        <div className="col-span-1 text-center">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            &nbsp;
          </label>
          <button
            onClick={onRemove}
            className="rounded-full h-8 w-8 text-red-600 hover:text-red-600 hover:bg-red-50 font-medium text-xl leading-0 border border-red-300 hover:border-red-400 transition-colors"
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineItem;
