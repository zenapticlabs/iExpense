import { ExpenseType } from "@/utils/UtilData";

export const FormData = {
  [ExpenseType.airFare]: {
    fields: [
      {
        name: "airline",
        label: "Airline",
        type: "dropdown",
        resource: "airlines",
        required: true,
      },
      {
        name: "origin",
        label: "Origin",
        type: "text",
        required: true,
      },
      {
        name: "destination",
        label: "Destination",
        type: "text",
        required: true,
      },
    ],
  },
  [ExpenseType.autoRental]: {
    fields: [
      {
        name: "car_type",
        label: "Car Type",
        type: "dropdown",
        resource: "car-types",
        required: true,
      },
      {
        name: "rental_agency",
        label: "Rental Agency",
        type: "dropdown",
        resource: "rental-agencies",
        required: true,
      },
    ],
  },
  [ExpenseType.businessMeals]: {
    fields: [
      {
        name: "meal_category",
        label: "Meal Category",
        type: "dropdown",
        resource: "meal-categories",
        required: true,
      },
      {
        name: "total_employees",
        label: "Total Employees",
        type: "number",
        required: true,
      },
      {
        name: "employee_names",
        label: "Employee Names",
        type: "text",
        required: true
      },
      {
        name: "employee_names2",
        label: "Additional Employee Names",
        type: "text"
      }
    ],
  },
  [ExpenseType.customerGifts]: {
    fields: [
      {
        name: "company_customer_name_title",
        label: "Company, Customer Name, Title",
        type: "text",
        required: true,
      },
    ]
  },
  [ExpenseType.entertainment]: {
    fields: [
      {
        name: "name_of_establishment",
        label: "Name of Establishment",
        type: "text",
        required: true,
      },
      {
        name: "city",
        label: "City",
        type: "dropdown",
        resource: "cities",
        required: true,
      },
      {
        name: "business_topic",
        label: "Business Topic",
        type: "text",
        required: true,
      },
      {
        name: "relationship_to_pai",
        label: "Relationship to PAI",
        type: "dropdown",
        resource: "relationships-to-pai",
        required: true,
      },
      {
        name: "total_attendees",
        label: "Total Attendees",
        type: "number",
        required: true,
      },
      ...Array.from({ length: 10 }, (_, index) => ({
        name: `attendee${index + 1}`,
        label: `Attendee ${index + 1}`,
        type: "text",
        required: true,
        defaultValue: `Attendee ${index + 1}`,
      })),
    ],
  },
  [ExpenseType.entertainmentLevi]: {
    fields: [
      {
        name: "name_of_establishment",
        label: "Name of Establishment",
        type: "text",
        required: true,
      },
      {
        name: "city",
        label: "City",
        type: "dropdown",
        resource: "cities",
        required: true,
      },
      {
        name: "business_topic",
        label: "Business Topic",
        type: "text",
        required: true,
      },
      {
        name: "total_attendees",
        label: "Total Attendees",
        type: "text",
        required: true,
      },
      ...Array.from({ length: 10 }, (_, index) => ({
        name: `attendee${index + 1}`,
        label: `Attendee ${index + 1}`,
        type: "text",
        required: true,
        defaultValue: `Attendee ${index + 1}`,
      })),
    ],
  },
  [ExpenseType.hotel]: {
    fields: [
      {
        name: "hotel_name",
        label: "Hotel Name",
        type: "text",
        required: true,
      },
      {
        name: "city",
        label: "City",
        type: "dropdown",
        resource: "cities",
        required: true,
      },
    ],
  },
  [ExpenseType.mileage]: {
    fields: [
      {
        name: "origin",
        label: "Origin",
        type: "text",
        required: true,
      },
      {
        name: "destination",
        label: "Destination",
        type: "text",
        required: true,
      },
      {
        name: "distance",
        label: "Distance",
        type: "text",
        required: true,
      }
    ],
  },
  [ExpenseType.telephoneCell]: {
    fields: [
      {
        name: "carrier",
        label: "Carrier",
        type: "text",
        required: true,
      },
    ],
  },
  [ExpenseType.telephoneHome]: {
    fields: [
      {
        name: "carrier",
        label: "Carrier",
        type: "text",
        required: true,
      },
    ],
  },
  [ExpenseType.internetHome]: {
    fields: [
      {
        name: "carrier",
        label: "Carrier",
        type: "text",
        required: true,
      },
    ],
  },
  [ExpenseType.internetHotelAirplane]: {
    fields: [
      {
        name: "carrier",
        label: "Carrier",
        type: "text",
        required: true,
      },
    ],
  },
};
