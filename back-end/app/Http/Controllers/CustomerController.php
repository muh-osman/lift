<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

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
     */
    public function getCustomersToVisitToday()
    {
        $today = Carbon::today();

        // Get customers that need to be visited today
        $customersToVisit = Customer::where(function ($query) use ($today) {
            // Monthly maintenance
            $query->where('maintenance_type', 'شهري')
                ->whereDate('contract_start_date', '<=', $today)
                ->whereDate('contract_end_date', '>=', $today)
                ->whereRaw('MOD(DATEDIFF(?, contract_start_date), 30) = 0', [$today]);

            // Every two months maintenance
            $query->orWhere(function ($subQuery) use ($today) {
                $subQuery->where('maintenance_type', 'شهرين')
                    ->whereDate('contract_start_date', '<=', $today)
                    ->whereDate('contract_end_date', '>=', $today)
                    ->whereRaw('MOD(DATEDIFF(?, contract_start_date), 60) = 0', [$today]);
            });
        })->get();

        // Check if any customers were found
        if ($customersToVisit->isEmpty()) {
            return response()->json([], Response::HTTP_OK);
        }

        return response()->json($customersToVisit, Response::HTTP_OK);
    }
}
