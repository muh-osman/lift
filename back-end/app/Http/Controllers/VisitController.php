<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class VisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $visits = Visit::all();
        return response()->json($visits, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'maintenance_type' => 'required|string|max:255',
            'comments' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:9048',
        ]);

        $visitData = [
            'user_id' => Auth::id(),
            'customer_id' => $request->customer_id,
            'maintenance_type' => $request->maintenance_type,
            'comments' => $request->comments,
        ];

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            // Move the file to the public/images directory
            $file->move(public_path('images/visits'), $filename);
            // Create the URL for the image
            $visitData['image'] = asset('images/visits/' . $filename);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Image file is required',
            ], 422);
        }

        $visit = Visit::create($visitData);

        return response()->json($visit, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $visit  = Visit::findOrFail($id);
        return response()->json($visit, Response::HTTP_OK);
    }
}
