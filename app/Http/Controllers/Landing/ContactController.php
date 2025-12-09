<?php
namespace App\Http\Controllers\Landing;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $toEmail = config('mail.from.address');
        $toName = config('mail.from.name') ?: 'Donsol TMS';

        Mail::send('contact', [
        'senderName' => $request->name,
        'senderEmail' => $request->email,
        'senderMessage' => $request->message,
        ], function ($message) use ($toEmail, $toName, $request) {
            $message->to($toEmail, $toName)
                    ->subject('New Contact Form Message from ' . $request->name)
                    ->replyTo($request->email, $request->name);
        });

        return back()->with('success', 'Your message has been sent successfully!');
    }
}