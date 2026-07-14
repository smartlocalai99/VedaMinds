

export async function createVendor(userData, vendorData) {

  return await prisma.$transaction(async (tx) => {

    const vendorRole = await tx.role.findUnique({
      where: {
        name: "VENDOR",
      },
    });

    if (!vendorRole) {
      throw new Error("Vendor role not found.");
    }

    const user = await tx.user.create({
      data: {
        userCode: vendorData.vendorCode,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        roleId: vendorRole.id,
        status: "ACTIVE",
        emailVerified: false,
        mustChangePassword: true,
      },
    });

    const vendor = await tx.vendor.create({
      data: {
        vendorCode: vendorData.vendorCode,
        userId: user.id,
        agentId: vendorData.agentId,
        ownerName: vendorData.ownerName,
        shopName: vendorData.shopName,
        businessType: vendorData.businessType,
        gstNumber: vendorData.gstNumber,
        address: vendorData.address,
        city: vendorData.city,
        state: vendorData.state,
        pincode: vendorData.pincode,
      },
      include: {
        user: true,
        agent: true,
      },
    });

    // ✅ RETURN MUST BE INSIDE THE TRANSACTION
    return {
      user,
      vendor,
    };

  });

}


// Get Vendors By Agent
export async function getVendorsByAgent(agentId) {
  return await prisma.vendor.findMany({
    where: {
      agentId,
      isDeleted: false,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateVendor(userId, vendorId, userData, vendorData) {

  return await prisma.$transaction(async (tx) => {

    await tx.user.update({
      where: {
        id: userId,
      },
      data: userData,
    });

    const vendor = await tx.vendor.update({
      where: {
        id: vendorId,
      },
      data: vendorData,
      include: {
        user: true,
      },
    });

    return vendor;

  });

}

export async function deleteVendor(id) {

  return await prisma.$transaction(async (tx) => {

    // Find Vendor
    const vendor = await tx.vendor.findUnique({
      where: {
        id,
      },
    });

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // Delete Vendor
    await tx.vendor.delete({
      where: {
        id,
      },
    });

    // Delete User
    await tx.user.delete({
      where: {
        id: vendor.userId,
      },
    });

    return {
      success: true,
    };

  });

}