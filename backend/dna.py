# Majid Hadji, CS 115, Sumer 2025
# Programming Lab week 7, 08/18/25
# This program will process data from genome files writes to a file.

# ---------------- Global Constants ----------------
MIN_CODONS = 5             # Minimum number of codons for a valid protein
MIN_CG_PERCENT = 30        # Minimum % mass from C+G for a valid protein
NUM_NUCLEOTIDES = 4        # A, C, G, T
NUCLEOTIDES_PER_CODON = 3  # 3 nucleotides per codon

# Masses for each nucleotide
NUCLEOTIDE_MASSES = {'A': 135.128, 'C': 111.103, 'G': 151.128, 'T': 125.107}


def nucleotide_index(n):
    #Map nucleotide to index in counts list: [A, C, T, G]
    mapping = {'A': 0, 'C': 1, 'T': 2, 'G': 3}
    return mapping[n]

def print_nucleotides(nucleotide_list):
    #Print all nucleotides in one line#
    print("Nucleotides: ", end='')
    for n in nucleotide_list:
        print(n, end='')
    print()

def count_nucleotides(nucleotide_list):
    #Count occurrences of A, C, T, G in nucleotide_list
    counts = [0] * NUM_NUCLEOTIDES  # [A, C, T, G]
    for n in nucleotide_list:
        counts[nucleotide_index(n)] += 1
    return counts

def compute_mass_percentages(counts):
    nucleotides = ['A', 'C', 'T', 'G']
    masses = []
    for i, n in enumerate(nucleotides):
        mass = counts[i] * NUCLEOTIDE_MASSES[n]
        masses.append(mass)
    total_mass = sum(masses)
    percentages = []
    for m in masses:
        percent = round(m / total_mass * 100, 1)
        percentages.append(percent)
    return percentages, round(total_mass, 1)

def generate_codons(nucleotide_list):
    #Create list of codons (triplets of nucleotides)
    codons = []
    for i in range(0, len(nucleotide_list), NUCLEOTIDES_PER_CODON):
        codon = ''.join(nucleotide_list[i:i+NUCLEOTIDES_PER_CODON])
        codons.append(codon)
    return codons

def is_protein(codons, counts, total_mass):
    #Determine if the sequence meets protein criteria
    # begins with a valid start codon   (ATG)
    start_ok = codons[0] == "ATG"
    # ends with a valid stop codon(one of the following: TAA, TAG, or TGA)
    stop_ok = codons[-1] in ["TAA", "TAG", "TGA"]
    # contains at least 5 total codons(including its initial start codon and final stop codon)
    length_ok = len(codons) >= MIN_CODONS
    # Cytosine (C) and Guanine (G) combined account for at least 30% of its total mass
    cg_mass = counts[1]*NUCLEOTIDE_MASSES['C'] + counts[3]*NUCLEOTIDE_MASSES['G']
    cg_ok = (cg_mass / total_mass * 100) >= MIN_CG_PERCENT
    return start_ok and stop_ok and length_ok and cg_ok

def analyze_dna_sequence(nucleotides):
    """
    Analyzes a list of nucleotides and returns a dictionary of results.
    Used for API/Web interface.
    """
    counts = count_nucleotides(nucleotides)
    mass_percentages, total_mass = compute_mass_percentages(counts)
    codons = generate_codons(nucleotides)
    is_prot = is_protein(codons, counts, total_mass)
    
    return {
        "nucleotides": "".join(nucleotides),
        "counts": counts,
        "mass_percentages": mass_percentages,
        "total_mass": total_mass,
        "codons": codons,
        "is_protein": is_prot
    }

def file_output_print(filename):
    nucleotides = []
    with open(filename, 'r') as f:
        for line in f:
            for n in line.upper():
                if n in 'ATGC':
                    nucleotides.append(n)

    print_nucleotides(nucleotides)
    
    counts = count_nucleotides(nucleotides)
    print(f"Nuc. Counts: {counts}")
    
    mass_percentages, total_mass = compute_mass_percentages(counts)
    print(f"Total Mass%: {mass_percentages} of {total_mass}")
    
    codons = generate_codons(nucleotides)
    print(f"Codons List: {codons}")
    
    protein_result = 'YES' if is_protein(codons, counts, total_mass) else 'NO'
    print(f"Is Protein?: {protein_result}")

    output_file(
        filename, nucleotides, counts, mass_percentages,
        total_mass, codons, protein_result
    )

def output_file(filename, nucleotides, counts, mass_percentages,
                 total_mass, codons, protein_result):
    output_filename = f"expected_output_{filename}"
    with open(output_filename, 'w') as out:
        out.write(
            "This program reports information about DNA\n"
        )
        out.write(
            "nucleotide sequences that may encode proteins.\n"
        )
        out.write(
            f"Nucleotides: {''.join(nucleotides)}\n"
        )
        out.write(
            f"Nuc. Counts: {counts}\n"
        )
        out.write(
            f"Total Mass%: {mass_percentages} of {total_mass}\n"
        )
        out.write(
            f"Codons List: {codons}\n"
        )
        out.write(
            f"Is Protein?: {protein_result}\n"
        )
    print(f"\nReport saved to {output_filename}")

def main():
    print("This program reports information about DNA")
    print("nucleotide sequences that may encode proteins.")
    print("Type 'exit' to quit at any time.\n")

    while True:
        filename = input("Input file name? ").strip()
        if filename.lower() in ("exit", "quit"):
            print("Exiting program. Goodbye!")
            break
        try:
            file_output_print(filename)
            break  # stop loop if file is found and processed
        except FileNotFoundError:
            print(
                f"❌ File '{filename}' not found. Please try again."
            )

if __name__ == "__main__":
    main()
