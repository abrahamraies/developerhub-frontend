import { useFormContext } from 'react-hook-form'
import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'

const TagsInput = ({ name }: { name: string }) => {
  const { setValue, getValues } = useFormContext()
  const [inputValue, setInputValue] = useState('')

  const tags = getValues(name) || []

  const addTag = () => {
    if (inputValue && !tags.includes(inputValue) && tags.length < 10) {
      setValue(name, [...tags, inputValue], { shouldValidate: true })
      setInputValue('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue(
      name,
      tags.filter((tag: string) => tag !== tagToRemove),
      { shouldValidate: true }
    )
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Etiquetas
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag: string) => (
          <span
            key={tag}
            className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-medium border border-blue-200 dark:border-blue-800"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1.5 inline-flex text-blue-500 hover:text-blue-700 dark:hover:text-blue-200"
            >
              <XMarkIcon className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="block w-full px-3 py-2 bg-gray-50/80 dark:bg-gray-700/60 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 sm:text-sm"
          placeholder="Añadir etiqueta (Enter para agregar)"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!inputValue}
          className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Añadir
        </button>
      </div>
      {tags.length >= 10 && (
        <p className="mt-1 text-sm text-red-500">Máximo 10 etiquetas alcanzado</p>
      )}
    </div>
  )
}

export default TagsInput