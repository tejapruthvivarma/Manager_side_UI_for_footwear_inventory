#!/usr/bin/perl

#    This code uses the Crypt::Password module.  This module uses
#    SHA2, which uses a 256 or 512 bit key, which generates a 512 or 1024 
#    bit block.  The longer key makes this algorithm better, as does the fact
#    that it appears to be impervious to collisions, which makes it more
#    resistant to hacking.  This is the algorithm generally used by the 
#    US government.  This algorithm is still not widely used in industry, 
#    though it should be.
    

use Crypt::Password;

my $password = "abc123";
my $salt = "5y7Pwqx3";
#options are sha256 or sha512
my $encrypted_password = Crypt::Password->new($password, $salt, sha256);
print "The encrypted password is:\n $encrypted_password\n\n";

#    Now get a password from the user and see if it matches
print "Enter your password: ";
$read_pass = <STDIN>;
chomp $read_pass; #remove the \n from the end

if(check_password($encrypted_password, $read_pass)) {
    print "Password is OK, access granted.\n";
    }
else {
    print "Password is invalid, access denied.\n";
    }
