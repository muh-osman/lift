<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Visit;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = Customer::all();
        return response()->json($customers, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if the authenticated user has the role of 91
        if (Auth::user()->role !== 91) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'neighborhood' => 'required|string|max:255',
            'maintenance_type' => 'required|string|max:255',
            'spare_parts' => 'required|string|max:255',
            'service_type' => 'required|string|max:255',
            'contract_start_date' => 'required|date',
            'contract_end_date' => 'required|date',
            'maintenance_value' => 'required|numeric',
            'paid' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);


        $customer = Customer::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'phone_number' => $request->phone_number,
            'neighborhood' => $request->neighborhood,
            'maintenance_type' => $request->maintenance_type,
            'spare_parts' => $request->spare_parts,
            'service_type' => $request->service_type,
            'contract_start_date' => $request->contract_start_date,
            'contract_end_date' => $request->contract_end_date,
            'maintenance_value' => $request->maintenance_value,
            'paid' => $request->paid,
            'unpaid' => $request->maintenance_value - $request->paid,
            'notes' => $request->notes,
        ]);

        return response()->json($customer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $customer = Customer::findOrFail($id);
        return response()->json($customer, Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Check if the authenticated user has the role of 91
        if (Auth::user()->role !== 91) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $customer = Customer::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'phone_number' => 'sometimes|required|string|max:15',
            'neighborhood' => 'sometimes|required|string|max:255',
            'maintenance_type' => 'sometimes|required|string|max:255',
            'spare_parts' => 'sometimes|required|string|max:255',
            'service_type' => 'sometimes|required|string|max:255',
            'contract_start_date' => 'sometimes|required|date',
            'contract_end_date' => 'sometimes|required|date',
            'maintenance_value' => 'sometimes|required|numeric',
            'paid' => 'sometimes|required|numeric',
            'notes' => 'nullable|string',
        ]);

        // Calculate unpaid if maintenance_value and paid are present
        if ($request->has('maintenance_value') && $request->has('paid')) {
            $unpaid = $request->maintenance_value - $request->paid;
            $customer->unpaid = $unpaid;
        }

        // Update the customer with the request data
        $customer->update($request->all());

        return response()->json($customer, Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Check if the authenticated user has the role of 91
        if (Auth::user()->role !== 91) {
            return response()->json(['error' => 'Unauthorized'], Response::HTTP_FORBIDDEN);
        }

        $customer = Customer::findOrFail($id);
        $customer->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * Get the ID and name of all customers.
     */
    public function getCustomerIdsAndNames()
    {
        // Retrieve only the id and name fields from the Customer model
        $customers = Customer::select('id', 'name')->get();

        // Return the customers in a JSON response
        return response()->json($customers, Response::HTTP_OK);
    }



    /**
     * Get customers to visit today based on maintenance type.
     *
     * Contract NOT expired
     * Return customer who have not had a visit in the last 30 days or more
     *
     */

    public function getCustomersToVisitToday()
    {
        // Get today's date
        $today = Carbon::today();

        // Get customers whose contracts are not expired
        $customers = Customer::where('contract_start_date', '<=', $today)
            ->where('contract_end_date', '>=', $today)
            ->get();


        // Initialize an array to hold customer IDs who need a visit
        $customersToVisit = [];

        foreach ($customers as $customer) {

            // Determine the visit period based on maintenance_type
            $visitPeriod = null;

            if ($customer->maintenance_type === "شهري") {
                $visitPeriod = 30;
            } elseif ($customer->maintenance_type === "شهرين") {
                $visitPeriod = 60;
            }


            // Check if the customer has had a visit in the determined period, ignoring visits with maintenance_type "عطل"
            $hasRecentVisit = Visit::where('customer_id', $customer->id)
                ->where('created_at', '>=', $today->subDays($visitPeriod))
                ->where('maintenance_type', '!=', 'عطل') // Ignore visits with maintenance_type "عطل"
                ->exists();


            // If the customer has not had a recent visit, check against contract_start_date
            if (!$hasRecentVisit) {
                // Convert contract_start_date to a Carbon instance for comparison
                $contractStartDate = Carbon::parse($customer->contract_start_date);

                $today = Carbon::today(); //Reset the $today variable

                // Check if the contract_start_date is NOT within the visit period
                $isContractInactive = $contractStartDate < $today->subDays($visitPeriod);

                // If the contract_start_date is NOT within the visit period, add the customer to the list
                if ($isContractInactive) { // Change this condition
                    $customersToVisit[] = $customer;
                }
            }

            // Reset the $today variable to the original value for the next iteration
            $today = Carbon::today();
        }

        Log::info('Customers to visit: ', $customersToVisit);

        return response()->json($customersToVisit, Response::HTTP_OK);
    }


    /**
     * Get customers to visit today and customers who have visited today.
     */
    public function getCustomersToVisitAndVisitedToday()
    {
        // Get today's date
        $today = Carbon::today();

        // Get customers to visit today
        $customersToVisit = $this->getCustomersToVisitToday()->getData();

        // Get customers who have visited today
        $visitedToday = Visit::whereDate('created_at', $today)
            ->pluck('customer_id')
            ->unique();

        // Retrieve the customer details for those who have visited today
        $customersVisitedToday = Customer::whereIn('id', $visitedToday)->get();

        // Prepare the response
        $response = [
            'customers_to_visit_today' => $customersToVisit,
            'customers_visited_today' => $customersVisitedToday,
        ];

        return response()->json($response, Response::HTTP_OK);
    }



    /**
     * Get the last visit that happened today for a specific customer.
     *
     * @param int $customerId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLastVisitTodayForCustomer($customerId)
    {
        // Find the customer to ensure it exists
        $customer = Customer::find($customerId);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }

        // Get the last visit for the specified customer that happened today
        $lastVisitToday = Visit::where('customer_id', $customerId)
            ->whereDate('created_at', Carbon::today())
            ->orderBy('created_at', 'desc')
            ->first();

        // Check if there is a last visit today
        if (!$lastVisitToday) {
            return response()->json(['message' => 'No visits found today for this customer'], Response::HTTP_OK);
        }

        // Return the last visit details
        return response()->json($lastVisitToday, Response::HTTP_OK);
    }


    /**
     * Get customers whose contracts will end within the next 30 days.
     */
    public function getCustomersWithAlmostExpiringContracts()
    {
        // Get today's date
        $today = Carbon::today();

        // Calculate the date 30 days from today
        $endDate = $today->copy()->addDays(30);

        // Get customers whose contract_end_date is between today and the calculated end date
        $customers = Customer::where('contract_end_date', '>=', $today)
            ->where('contract_end_date', '<=', $endDate)
            ->orderBy('contract_end_date', 'asc') // Order by contract_end_date ascending
            ->get();

        // Return the customers in a JSON response
        return response()->json($customers, Response::HTTP_OK);
    }


    /**
     * Get customers whose contracts have expired.
     */
    public function getExpiredContracts()
    {
        // Get today's date
        $today = Carbon::today();

        // Get customers whose contract_end_date is less than today
        // Order by contract_end_date from older to newer
        $customers = Customer::where('contract_end_date', '<', $today)
            ->orderBy('contract_end_date', 'desc') // Order by contract_end_date ascending
            ->get();


        // Return the customers in a JSON response
        return response()->json($customers, Response::HTTP_OK);
    }


    /**
     * Get the visits of a specific customer.
     *
     * @param int $customerId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getCustomerVisits($customerId)
    {
        // Find the customer to ensure it exists
        $customer = Customer::find($customerId);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }

        // Get the visits for the specified customer and include the customer's name and user's email
        $visits = Visit::where('customer_id', $customerId)
            ->with(['customer:id,name', 'user:id,email']) // Eager load the customer and user relationships
            ->get()
            ->map(function ($visit) {
                return [
                    'id' => $visit->id,
                    'user_email' => $visit->user->email, // ايميل الفني الذي قام بالزيارة
                    'maintenance_type' => $visit->maintenance_type,
                    'comments' => $visit->comments,
                    'image' => $visit->image,
                    'customer_name' => $visit->customer->name, // Include the customer's name
                    'created_at' => $visit->created_at,
                ];
            });

        // Return the visits in a JSON response
        return response()->json($visits, Response::HTTP_OK);
    }
}
