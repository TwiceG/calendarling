<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\QueryRepositories\NoteRepository;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NoteController extends Controller
{
    public function getWeekNotes(Request $request)
    {
        $date = $request->query('date');
        return NoteRepository::getNotes($date);
    }

    public function addNote(Request $request)
    {
        $date = $request->json('date');
        $note = $request->json('note');

        return NoteRepository::addNote($note, $date);
    }
}