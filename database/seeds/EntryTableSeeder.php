<?php

use Illuminate\Database\Seeder;
use App\Entry;

class EntryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
 
        // Create 50 product records
        for ($i = 0; $i < 50; $i++) {
            Entry::create([
                'type' => $faker->boolean(50),
                'description' => $faker->chrome,
                'amount' => $faker->randomNumber(2),
                'dt_due' => $faker->dateTime
            ]);        
        }
    }
}
