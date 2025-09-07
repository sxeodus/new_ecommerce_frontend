import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useProductStore } from '../../stores/productStore'
import toast from 'react-hot-toast'
import api from '../../api/axios'

function CreateProduct() {
  const navigate = useNavigate()
  const createProduct = useProductStore((state) => state.createProduct)
  const [uploading, setUploading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm()

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const res = await api.post('/upload', formData)
      setValue('image', res.data.image) // Set the form value to the returned image path
      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error(error.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    // The backend expects numbers for price and countInStock
    const productData = {
      ...data,
      price: parseFloat(data.price),
    }

    const newProduct = await createProduct(productData)
    if (newProduct) {
      navigate('/admin/products')
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Create New Product</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg bg-white p-8 shadow-md">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Product name is required' })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.name && <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="mb-2 block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { required: 'Price is required', valueAsNumber: true, min: { value: 0, message: 'Price cannot be negative' } })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.price && <p className="mt-2 text-sm text-red-500">{errors.price.message}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="mb-2 block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              id="image"
              type="text"
              {...register('image', { required: 'Image URL is required' })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.image && <p className="mt-2 text-sm text-red-500">{errors.image.message}</p>}
            {/* File Input */}
            <input
              type="file"
              id="image-file"
              aria-label="Choose File"
              onChange={uploadFileHandler}
              className="mt-2 block w-full text-sm text-gray-500
                file:mr-4 file:rounded-md file:border-0
                file:bg-blue-600 file:px-4 file:py-2
                file:text-sm file:font-semibold file:text-white
                hover:file:bg-blue-700"
            />
            {uploading && (
              <div className="mt-2 text-sm text-blue-600">Uploading...</div>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              id="category"
              type="text"
              {...register('category', { required: 'Category is required' })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.category && <p className="mt-2 text-sm text-red-500">{errors.category.message}</p>}
          </div>

          {/* Count in Stock */}
          <div>
            <label htmlFor="countInStock" className="mb-2 block text-sm font-medium text-gray-700">
              Count in Stock
            </label>
            <input
              id="countInStock"
              type="number"
              {...register('countInStock', { required: 'Stock count is required', valueAsNumber: true, min: { value: 0, message: 'Stock cannot be negative' } })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.countInStock && <p className="mt-2 text-sm text-red-500">{errors.countInStock.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', { required: 'Description is required' })}
              className="block w-full rounded-md border-0 bg-gray-100 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
            />
            {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProduct