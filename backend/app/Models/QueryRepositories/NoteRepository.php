<?php

namespace App\Models\QueryRepositories;

use Illuminate\Support\Facades\DB;
use PhpParser\Node\Scalar\String_;

class NoteRepository
{
    public static function getNotes($date): array
    {
        $dates = self::getDates($date);
        $notes = [];
        foreach ($dates as $date) {
            $notes[] = self::getNote($date);
        }

        return $notes;
    }

    public static function addNote(string $note, string $date): bool
    {
        $dateObject = \DateTime::createFromFormat('Y-m-d', $date);
        $formattedDate = $dateObject ? $dateObject->format('Y-m-d') : $date;

        $noteToUpdate = self::getNote($date);

        if ($noteToUpdate == '') {
            return DB::table('notes')->insert(
                [
                    'date' => $formattedDate,
                    'note' => $note
                ]
            );
        } else {
            return DB::table('notes')
                ->where('date', $formattedDate)
                ->update(
                    [
                        'note' => $note
                    ]
                ) > 0;
        }
    }


    public static function getNote($date)
    {
        $dateObject = \DateTime::createFromFormat('Y-m-d', $date);
        $formattedDate = $dateObject ? $dateObject->format('Y-m-d') : $date;

        $note = DB::table('notes')->where('date', $formattedDate)->first();

        return $note ?? '';
    }

    public static function getDates($date): array
    {
        // Convert the input date string to a DateTime object
        $dateObject = \DateTime::createFromFormat('Y-m-d', $date);

        // If the date format is invalid, return an empty array
        if (!$dateObject) {
            return [];
        }

        // Clone the date and set it to the start of the week (Monday)
        $startOfWeek = clone $dateObject;
        $startOfWeek->modify('this week')->modify('monday');

        // Clone the start date to get to the end of the week (Sunday)
        $endOfWeek = clone $startOfWeek;
        $endOfWeek->modify('+6 days');

        // Generate an array with all dates from Monday to Sunday
        $dates = [];
        while ($startOfWeek <= $endOfWeek) {
            $dates[] = $startOfWeek->format('Y-m-d');
            $startOfWeek->modify('+1 day');
        }

        return $dates;
    }
}
