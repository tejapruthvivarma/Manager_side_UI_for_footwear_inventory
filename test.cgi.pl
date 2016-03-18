#!/usr/bin/perl

use CGI;

my $q=new CGI;
my $username= $q->param("user");
my $password=$q->param("pwd");

print "Content-type:text/html";
print "Username: $username \n Password: $password";

exit;