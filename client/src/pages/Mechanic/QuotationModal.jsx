import React, { useState, useEffect } from 'react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { X } from 'lucide-react'

const QuotationModal = ({ 
  show, 
  onClose, 
  vehicle, 
  parts, 
  onSubmit 
}) => {
  const [quotationData, setQuotationData] = useState({
    diagnosis: '',
    parts: [],
    serviceCharge: 0,
    includeVAT: false,
    taxRate: 18,
    discountAmount: 0
  })
  const [partSearch, setPartSearch] = useState('')
  const [filteredParts, setFilteredParts] = useState([])

  // Reset data when modal opens
  useEffect(() => {
    if (show) {
      setQuotationData({
        diagnosis: '',
        parts: [],
        serviceCharge: 0,
        includeVAT: false,
        taxRate: 18,
        discountAmount: 0
      })
      setPartSearch('')
      setFilteredParts([])
    }
  }, [show])

  // Filter parts based on search
  useEffect(() => {
    if (partSearch && partSearch.trim().length > 0) {
      const filtered = parts?.filter(part => 
        part.name.toLowerCase().includes(partSearch.toLowerCase()) ||
        part.partNumber.toLowerCase().includes(partSearch.toLowerCase())
      ) || []
      setFilteredParts(filtered.slice(0, 10))
    } else {
      setFilteredParts([])
    }
  }, [partSearch, parts])

  const handleAddPart = (part) => {
    const newPart = {
      partId: part._id,
      quantity: 1,
      unitPrice: part.pricing.sellingPrice,
      totalPrice: part.pricing.sellingPrice,
      description: `${part.name} - ${part.category}`,
      availability: part.inventory.currentStock > 0 ? 'in-stock' : 'order-required'
    }
    setQuotationData(prev => ({
      ...prev,
      parts: [...prev.parts, newPart]
    }))
    setPartSearch('')
  }

  const handleUpdatePart = (index, field, value) => {
    setQuotationData(prev => {
      const updatedParts = [...prev.parts]
      updatedParts[index][field] = value
      if (field === 'quantity' || field === 'unitPrice') {
        updatedParts[index].totalPrice = updatedParts[index].quantity * updatedParts[index].unitPrice
      }
      return {
        ...prev,
        parts: updatedParts
      }
    })
  }

  const handleRemovePart = (index) => {
    setQuotationData(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = () => {
    console.log('Submitting quotation data:', quotationData)
    onSubmit(quotationData)
  }

  if (!show || !vehicle) return null

  const partsTotal = quotationData.parts.reduce((sum, part) => sum + part.totalPrice, 0)
  const subtotal = partsTotal + quotationData.serviceCharge - quotationData.discountAmount
  const taxAmount = quotationData.includeVAT ? (subtotal * quotationData.taxRate) / 100 : 0
  const grandTotal = subtotal + taxAmount

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create Quotation</h2>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6">
          {/* Vehicle Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Vehicle Information</h3>
            <p><strong>Vehicle:</strong> {vehicle.vehicleBrand} {vehicle.vehicleType}</p>
            <p><strong>Plate No:</strong> {vehicle.PlateNo}</p>
            <p><strong>Customer:</strong> {vehicle.customer?.name}</p>
          </div>

          {/* Diagnosis */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Diagnosis *</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              value={quotationData.diagnosis}
              onChange={(e) => setQuotationData(prev => ({...prev, diagnosis: e.target.value}))}
              placeholder="Enter your diagnosis and recommended repairs..."
              required
            />
          </div>

          {/* Parts Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Add Parts</label>
            <div className="relative mb-4">
              <Input
                placeholder="Search for parts..."
                value={partSearch}
                onChange={(e) => setPartSearch(e.target.value)}
              />
              {filteredParts.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                  {filteredParts.map(part => (
                    <div
                      key={part._id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleAddPart(part)}
                    >
                      <div className="font-medium">{part.name}</div>
                      <div className="text-sm text-gray-600">
                        {part.partNumber} - {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF'
                        }).format(part.pricing.sellingPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Stock: {part.inventory.currentStock}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Parts */}
            {quotationData.parts.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Selected Parts:</h4>
                {quotationData.parts.map((part, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{part.description}</div>
                      <Badge variant={part.availability === 'in-stock' ? 'default' : 'destructive'}>
                        {part.availability}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={part.quantity}
                        onChange={(e) => handleUpdatePart(index, 'quantity', parseInt(e.target.value))}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={part.unitPrice}
                        onChange={(e) => handleUpdatePart(index, 'unitPrice', parseFloat(e.target.value))}
                        className="w-32"
                      />
                      <div className="w-32 text-right font-medium">
                        {new Intl.NumberFormat('en-RW', {
                          style: 'currency',
                          currency: 'RWF'
                        }).format(part.totalPrice)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePart(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service Charge */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Service Charge</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={quotationData.serviceCharge}
              onChange={(e) => setQuotationData(prev => ({...prev, serviceCharge: parseFloat(e.target.value) || 0}))}
              placeholder="0"
            />
          </div>

          {/* Tax and Discount */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={quotationData.includeVAT}
                  onChange={(e) => setQuotationData(prev => ({...prev, includeVAT: e.target.checked}))}
                  className="mr-2"
                />
                Include VAT ({quotationData.taxRate}%)
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Amount</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={quotationData.discountAmount}
                onChange={(e) => setQuotationData(prev => ({...prev, discountAmount: parseFloat(e.target.value) || 0}))}
                placeholder="0"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between mb-2">
                  <span>Parts Total:</span>
                  <span>{new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(partsTotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service Charge:</span>
                  <span>{new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(quotationData.serviceCharge)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>{new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(subtotal)}</span>
                </div>
                {quotationData.includeVAT && (
                  <div className="flex justify-between mb-2">
                    <span>VAT ({quotationData.taxRate}%):</span>
                    <span>{new Intl.NumberFormat('en-RW', {
                      style: 'currency',
                      currency: 'RWF'
                    }).format(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>GRAND TOTAL:</span>
                  <span>{new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF'
                  }).format(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!quotationData.diagnosis || quotationData.parts.length === 0}
          >
            Create Quotation
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuotationModal
