import React, { Fragment } from 'react'
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

interface Option {
  value: string
  label: string
}

interface SelectMenuProps {
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
  options: Option[]
  label?: string
  placeholder?: string
  multiple?: boolean
}

const classNames = (...classes: string[]) => classes.filter(Boolean).join(' ')

const SelectMenu: React.FC<SelectMenuProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  multiple = false,
}) => {
  const selectedOptions = multiple
    ? options.filter((option) => (value as string[])?.includes(option.value))
    : options.find((option) => option.value === value)

  const handleChange = (newValue: string | string[]) => {
    if (multiple) {
      const updatedValue = Array.isArray(value)
        ? value.includes(newValue as string)
          ? value.filter((v) => v !== newValue)
          : [...value, newValue as string]
        : [newValue as string]
      onChange(updatedValue)
    } else {
      onChange(newValue as string)
    }
  }

  const displayValue = () => {
    if (multiple) {
      return (selectedOptions as Option[]).length > 0
        ? (selectedOptions as Option[]).map((option) => option.label).join(', ')
        : placeholder
    } else {
      return (selectedOptions as Option)?.label || placeholder
    }
  }

  return (
    <div className="relative">
      {label && (
        <label className="mb-1 block text-sm font-medium leading-6 text-gray-900">{label}</label>
      )}
      <Listbox value={value} onChange={handleChange} multiple={multiple}>
        {({ open }) => (
          <>
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{displayValue()}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-8 pr-4'
                      )
                    }
                    value={option.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {option.label}
                        </span>

                        {selected && (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 left-0 flex items-center pl-1.5'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default SelectMenu
