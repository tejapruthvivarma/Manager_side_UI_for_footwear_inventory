#!/usr/bin/perl

# Nadimpally,Teja Pruthvi Varma
# jadrn037
# CS0645, Spring 2016
# Proj1

use CGI;
use CGI::Session;
use CGI::Carp qw (fatalsToBrowser);

my $q = new CGI;
my $sid = $q->cookie("jadrn037SID") || undef;
$session = new CGI::Session(undef, $sid, {Directory => '/tmp'});
$session->delete();
my $cookie = $q->cookie(jadrn037SID => '');
print $q->header( -cookie=>$cookie ); #send cookie with session ID to browser  
   print "Content-type: text/html\n\n";



exit;



