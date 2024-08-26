<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users');
            $table->string('name');
            $table->string('phone_number');
            $table->string('neighborhood');
            $table->string('maintenance_type');
            $table->string('spare_parts');
            $table->string('service_type');
            $table->date('contract_start_date');
            $table->date('contract_end_date');
            $table->decimal('maintenance_value', 10, 2);
            $table->decimal('paid', 10, 2);
            $table->decimal('unpaid', 10, 2);
            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
